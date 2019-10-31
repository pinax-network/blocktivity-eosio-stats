import * as dotenv from "dotenv"
import { Authorization } from "./interfaces";
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { createDfuseClient } from "@dfuse/client";
import { JsonRpc as HyperionRpc } from "@eoscafe/hyperion";
const { TextEncoder, TextDecoder } = require('util');

;(global as any).fetch = require("node-fetch")
;(global as any).WebSocket = require("ws")

dotenv.config();

const fetch = require('node-fetch');

export const HISTORY_TYPE = process.env.HISTORY_TYPE || 'dfuse';

if (!process.env.PRIVATE_KEY) throw new Error("[PRIVATE_KEY] is required");
if (process.env.PRIVATE_KEY.includes("PRIVATE")) throw new Error("[PRIVATE_KEY] invalid key")

if (HISTORY_TYPE == 'dfuse') {
  if (!process.env.DFUSE_TOKEN) throw new Error("[DFUSE_TOKEN] is required");
  if (process.env.DFUSE_TOKEN.includes("PRIVATE")) throw new Error("[DFUSE_TOKEN] invalid token")
}

export const endpoint = process.env.NODEOS_ENDPOINT || 'http://api.eosn.io';
export const endpoint_history = process.env.NODEOS_ENDPOINT_HISTORY || 'http://eos.greymass.com';
export const endpoint_contract = process.env.NODEOS_ENDPOINT_CONTRACT || 'http://localhost:8888';
export const actor = process.env.ACTOR || 'blocktivity1';
export const permission = process.env.PERMISSION || 'push';
export const apiKey = process.env.DFUSE_TOKEN || '';

export const signatureProvider = new JsSignatureProvider([process.env.PRIVATE_KEY]);
export const rpc = new JsonRpc(endpoint, { fetch });
export const rpc_contract = new JsonRpc(endpoint_contract, { fetch });
export const hyperion = new HyperionRpc(endpoint, { fetch })
export const rpc_history = new JsonRpc(endpoint_history, { fetch });
export const api = new Api({ rpc: rpc_contract, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
export const client = createDfuseClient({ apiKey, network: "mainnet" })
export const authorization: Authorization[] = [{
  actor,
  permission,
}];

export const ONE_HOUR = process.env.ONE_HOUR || 60 * 60 * 2; // 1 hour