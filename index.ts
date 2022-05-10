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

const blockMsg = bstreamProto.root.lookupType("dfuse.bstream.v1.Block")
const eosioBlockMsg = eosioProto.root.lookupType("dfuse.eosio.codec.v1.Block")
const forkStepEnum = bstreamProto.root.lookupEnum("dfuse.bstream.v1.ForkStep")

const forkStepNew = forkStepEnum.values["STEP_NEW"]
const forkStepUndo = forkStepEnum.values["STEP_UNDO"]
const forkStepIrreversible = forkStepEnum.values["STEP_IRREVERSIBLE"]

async function main() {
  if (process.argv.length <= 2) {
    console.error("Error: Wrong number of arguments")
    console.error()
    console.error("usage: node index.js <apiKey> [--full]")
    process.exit(1)
  }

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

  const showFull = process.argv.length > 3 && process.argv[3] == "--full"

  try {
    await new Promise(async (resolve, reject) => {
      let stream: any;

      try {
        const metadata = new grpc.Metadata()
        metadata.set("authorization", (await dfuse.getTokenInfo()).token)

        stream = client.Blocks(
          {
            start_block_num: 150000000,
            stop_block_num: 150000105,
            // include_filter_expr: 'action = *',
            exclude_filter_expr: 'action == "noop"',
            // By default, step events received are `new`, `undo` and `irreversible`, for irreversible only, uncommented the following
            // fork_steps: [forkStepIrreversible],
          },
          metadata
        )

        stream.on("data", (data: any) => {
          const { block: rawBlock } = data
          if (rawBlock.type_url !== "type.googleapis.com/dfuse.eosio.codec.v1.Block") {
            rejectStream(stream, reject, invalidTypeError(rawBlock.type_url))
            return
          }

          switch (data.step) {
            case "STEP_NEW":
              // Block is the new head block of the chain
              break
            case "STEP_UNDO":
              // Block has been forked out, should undo everything
              break
            case "STEP_IRREVERSIBLE":
              // Block is now irreversible, it's number will be ~360 blocks in the past
              break
          }

          const step = data.step.toLowerCase().replace(/step_/, "")
          const block: any = eosioBlockMsg.decode(rawBlock.value)

          // Use the "filtered" versions since all blocks returned by Firehose is always filtered
          const transactionCount = block.filteredTransactionTraces.length
          let actionCount = 0
          let systemActionCount = 0

          block.filteredTransactionTraces.forEach((trace: any) => {
            trace.actionTraces.forEach((actionTrace: any) => {
              actionCount += 1

              if (actionTrace.receiver === "eosio") {
                systemActionCount += 1
              }
            })
          })

          console.log(
            `Block #${block.number} (${block.id}, ${step}) - ${transactionCount} Transactions, ${actionCount} Actions (${systemActionCount} System Actions)`
          )
          if (showFull) {
            console.log(JSON.stringify(block, null, "  "))
          }
        })

        stream.on("error", (error: any) => {
          rejectStream(stream, reject, error)
        })

        stream.on("status", (status: any) => {
          if (status.code === 0) {
            resolveStream(stream, resolve)
            return
          }

          // On error, I've seen the "error" callback receiving it, so not sure in which case we would do something else here
        })
      } catch (error) {
        if (stream) {
          rejectStream(stream, reject, error)
        } else {
          reject(error)
        }
      }
    })
  } finally {
    // Clean up resources, should be performed only if the gRPC client (`client` here) and/or the dfuse client
    // (`dfuse` here) are not needed anymore. If you have pending stream, you should **not** close those since
    // they are required to make the stream works correctly.
    client.close()
    dfuse.release()
  }
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

function resolveStream(stream: any, resolver: any) {
  stream.cancel()
  resolver()
}

function rejectStream(stream: any, rejection: any, error: any) {
  stream.cancel()
  rejection(error)
}

function invalidTypeError(type: string) {
  return new Error(
    `invalid message type '${type}' received, are you connecting to the right endpoint?`
  )
}

main()
  .then(() => {
    console.log("Completed")
  })
  .catch((error) => {
    console.error("An error occurred", error)
  })