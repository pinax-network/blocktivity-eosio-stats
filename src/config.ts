import * as dotenv from "dotenv"
import { Authorization } from "./interfaces";
import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsonRpc as HyperionRpc } from "@eoscafe/hyperion";
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { createDfuseClient } from "@dfuse/client";
const { TextEncoder, TextDecoder } = require('util');

;(global as any).fetch = require("node-fetch")
;(global as any).WebSocket = require("ws")

dotenv.config();

const fetch = require('node-fetch');

if (!process.env.DFUSE_TOKEN) throw new Error("[DFUSE_TOKEN] is required");

export const endpoint = process.env.NODEOS_ENDPOINT || 'http://api.eosn.io';
export const contract = process.env.CONTRACT || 'blocktivity1';
export const actor = process.env.ACTOR || 'eosnationftw';
export const permission = process.env.PERMISSION || 'push';
export const apiKey = process.env.DFUSE_TOKEN;

// export const signatureProvider = new JsSignatureProvider([process.env.PRIVATE_KEY || '']);
export const rpc = new JsonRpc(endpoint, { fetch });
export const hyperion = new HyperionRpc(endpoint, { fetch })
// export const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
export const client = createDfuseClient({ apiKey, network: "mainnet" })
export const authorization: Authorization[] = [{
  actor,
  permission,
}];