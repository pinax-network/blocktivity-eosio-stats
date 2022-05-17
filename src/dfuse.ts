import path from "path"
import * as protoLoader from "@grpc/proto-loader"
import { createDfuseClient } from "@dfuse/client"
import ProtoBuf from "protobufjs"
import grpc from "grpc"

// Global required by dfuse client
global.fetch = require("node-fetch");
global.WebSocket = require("ws")

// env variables
const DFUSE_TOKEN = process.env.DFUSE_TOKEN || '';
const DFUSE_FIREHOSE_NETWORK = process.env.DFUSE_FIREHOSE_NETWORK || "eos.firehose.eosnation.io";
if (!process.env.DFUSE_TOKEN) throw new Error("[DFUSE_TOKEN] is required");
if (!process.env.DFUSE_FIREHOSE_NETWORK) throw new Error("[DFUSE_FIREHOSE_NETWORK] is required");

// protobufs
export const bstreamProto = loadProto("dfuse/bstream/v1/bstream.proto")
export const eosioProto = loadProto("dfuse/eosio/codec/v1/codec.proto")
export const bstreamService = loadGrpcPackageDefinition("dfuse/bstream/v1/bstream.proto").dfuse.bstream.v1

export const blockMsg = bstreamProto.root.lookupType("dfuse.bstream.v1.Block")
export const eosioBlockMsg = eosioProto.root.lookupType("dfuse.eosio.codec.v1.Block")
export const forkStepEnum = bstreamProto.root.lookupEnum("dfuse.bstream.v1.ForkStep")

export const forkStepIrreversible = forkStepEnum.values["STEP_IRREVERSIBLE"]

// dfuse client
export const dfuse = createDfuseClient({
  apiKey: DFUSE_TOKEN,
  network: DFUSE_FIREHOSE_NETWORK,
})

export const client = new bstreamService.BlockStreamV2(
  `${DFUSE_FIREHOSE_NETWORK}:9000`,
  grpc.credentials.createSsl(), {
    "grpc.max_receive_message_length": 1024 * 1024 * 100,
    "grpc.max_send_message_length": 1024 * 1024 * 100
  }
)

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

export function cancelStream(stream?: any, resolve?: any, error?: any) {
    console.log("reject", {error});
    client.close();
    dfuse.release();
    if ( stream ) stream.cancel()
    if ( resolve ) resolve(true);
}

process.on('SIGINT', () => {
    cancelStream(null, "Caught interrupt signal");
    process.exit();
});

function onData( data: any, callback: any ) {
    const { block: rawBlock } = data
    if (rawBlock.type_url !== "type.googleapis.com/dfuse.eosio.codec.v1.Block") {
        cancelStream(null, "[type_url] invalid")
        return
    }
    const block: any = eosioBlockMsg.decode(rawBlock.value)
    callback(block);
}

export async function streamBlocks( start_block_num: number, stop_block_num: number, callback: any ) {
    const token = (await dfuse.getTokenInfo()).token;
    const metadata = new grpc.Metadata()
    metadata.set("authorization", token);

    const stream = client.Blocks({
        start_block_num,
        stop_block_num,
        exclude_filter_expr: 'action == "*"',
        fork_steps: [forkStepIrreversible],
    }, metadata );

    return new Promise((resolve, reject) => {
        stream.on("data", (data: any) => onData(data, callback));
        stream.on("end", () => cancelStream( stream, resolve, "end"));
        stream.on("error", (error: any) => cancelStream( stream, reject, error));
    })
}