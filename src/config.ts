import * as dotenv from "dotenv"
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { createDfuseClient, Authorization } from "@dfuse/client";
import { JsonRpc as HyperionRpc } from "@eoscafe/hyperion";
const { TextEncoder, TextDecoder } = require('util');

;(global as any).fetch = require("node-fetch")
;(global as any).WebSocket = require("ws")

dotenv.config();

const fetch = require('node-fetch');

export const HISTORY_TYPE = process.env.HISTORY_TYPE || '';

if (!process.env.NODEOS_ENDPOINT) throw new Error("[NODEOS_ENDPOINT] is required");
if (!process.env.NETWORK) throw new Error("[NETWORK] is required");

if (!process.env.PRIVATE_KEYS) throw new Error("[PRIVATE_KEYS] is required");
if (process.env.PRIVATE_KEYS.includes("PRIVATE")) throw new Error("[PRIVATE_KEYS] invalid key")

if (HISTORY_TYPE == 'dfuse') {
  if (!process.env.DFUSE_TOKEN) throw new Error("[DFUSE_TOKEN] is required");
  if (process.env.DFUSE_TOKEN.includes("PRIVATE")) throw new Error("[DFUSE_TOKEN] invalid token")
}

if (HISTORY_TYPE == 'v1') {
  if (!process.env.NODEOS_ENDPOINT_HISTORY) throw new Error("[NODEOS_ENDPOINT_HISTORY] is required");
}

export const endpoint = process.env.NODEOS_ENDPOINT;
export const endpoint_history = process.env.NODEOS_ENDPOINT_HISTORY || "";
export const endpoint_contract = process.env.NODEOS_ENDPOINT_CONTRACT || endpoint;
export const actor = process.env.ACTOR || 'blocktivity1';
export const permission = process.env.PERMISSION || 'push';
export const apiKey = process.env.DFUSE_TOKEN || '';
export const network = process.env.NETWORK;
export const COSIGN = process.env.COSIGN || '';

export const signatureProvider = new JsSignatureProvider((process.env.PRIVATE_KEYS || "").split(","));
export const rpc = new JsonRpc(endpoint, { fetch });
export const rpc_contract = new JsonRpc(endpoint_contract, { fetch });
export const hyperion = new HyperionRpc(endpoint, { fetch })
export const rpc_history = new JsonRpc(endpoint_history, { fetch });
export const api = new Api({ rpc: rpc_contract, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
export const client = createDfuseClient({ apiKey, network })
export let authorization: Authorization[] = [];

if (COSIGN) {
  const [cosign_actor, cosign_permission] = COSIGN.split("@");
  authorization.push({ actor: cosign_actor, permission: cosign_permission })
}
authorization.push({ actor, permission })

export const ONE_HOUR = Number(process.env.ONE_HOUR || 60 * 60 * 2); // 1 hour
export const PAUSE_MS = Number(process.env.PAUSE_MS || 60 * 1000); // 1 minute
export const CONCURRENCY = Number(process.env.CONCURRENCY) || 3;
