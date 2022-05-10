import path from "path"
import grpc from "grpc"
import * as protoLoader from "@grpc/proto-loader"
import ProtoBuf from "protobufjs"
import { createDfuseClient } from "@dfuse/client"

// Global required by dfuse client
global.fetch = require("node-fetch");
global.WebSocket = require("ws")

const bstreamProto = loadProto("dfuse/bstream/v1/bstream.proto")
const eosioProto = loadProto("dfuse/eosio/codec/v1/codec.proto")

const bstreamService = loadGrpcPackageDefinition("dfuse/bstream/v1/bstream.proto").dfuse.bstream.v1

// const blockMsg = bstreamProto.root.lookupType("dfuse.bstream.v1.Block")
const eosioBlockMsg = eosioProto.root.lookupType("dfuse.eosio.codec.v1.Block")
const forkStepEnum = bstreamProto.root.lookupEnum("dfuse.bstream.v1.ForkStep")

const forkStepIrreversible = forkStepEnum.values["STEP_IRREVERSIBLE"]

const dfuse = createDfuseClient({
  apiKey: process.argv[2],
  network: "eos.firehose.eosnation.io",
})

const client = new bstreamService.BlockStreamV2(
  "eos.firehose.eosnation.io:9000",
  grpc.credentials.createSsl(), {
    "grpc.max_receive_message_length": 1024 * 1024 * 100,
    "grpc.max_send_message_length": 1024 * 1024 * 100
  }
)

function onData( data: any ) {
  const { block: rawBlock } = data
  if (rawBlock.type_url !== "type.googleapis.com/dfuse.eosio.codec.v1.Block") {
    cancelStream(null, invalidTypeError(rawBlock.type_url))
    return
  }
  const block: any = eosioBlockMsg.decode(rawBlock.value)

  // Use the "filtered" versions since all blocks returned by Firehose is always filtered
  const transactionCount = block.filteredTransactionTraces.length
  let actionCount = 0

  for ( const trace of block.filteredTransactionTraces ) {
    for ( const actionTrace of trace.actionTraces ) {
      actionCount += 1
    }
  }
  console.log(`Block #${block.number} ${transactionCount} Transactions, ${actionCount} Actions`)
}

async function main() {
  const token = (await dfuse.getTokenInfo()).token;
  const metadata = new grpc.Metadata()
  metadata.set("authorization", token);

  const stream = client.Blocks({
      start_block_num: 150000000,
      stop_block_num: 150000025,
      exclude_filter_expr: 'action == "*"',
      fork_steps: [forkStepIrreversible],
  }, metadata );
  console.log(stream.cancel)

  stream.on("data", onData);

  stream.on("end", () => {
    cancelStream( stream, "end");
  })

  stream.on("error", (error: any) => {
    cancelStream( stream, error);
  })
}

function loadGrpcPackageDefinition(pkg: any): any {
  const protoPath = path.resolve(__dirname, "proto", pkg)

  const proto = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })

  return grpc.loadPackageDefinition(proto)
}

function loadProto(pkg: any) {
  const protoPath = path.resolve(__dirname, "proto", pkg)

  return ProtoBuf.loadSync(protoPath)
}

function cancelStream(stream: any, error: any) {
  console.log("reject", {error});
  client.close();
  dfuse.release();
  if ( stream ) stream.cancel()
}

function invalidTypeError(type: string) {
  return new Error(
    `invalid message type '${type}' received, are you connecting to the right endpoint?`
  )
}

process.on('SIGINT', () => {
  cancelStream(null, "Caught interrupt signal");
  process.exit();
});

main()