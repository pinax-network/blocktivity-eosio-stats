import * as dotenv from "dotenv"
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { Authorization } from "eosjs/dist/eosjs-serialize";
// const { TextEncoder, TextDecoder } = require('util');
const fetch: any = require('node-fetch');

// ;(global as any).fetch = fetch
// ;(global as any).WebSocket = require("ws")

dotenv.config();

if (!process.env.NODEOS_ENDPOINT) throw new Error("[NODEOS_ENDPOINT] is required");
if (!process.env.PRIVATE_KEYS) throw new Error("[PRIVATE_KEYS] is required");
if (process.env.PRIVATE_KEYS.includes("PRIVATE")) throw new Error("[PRIVATE_KEYS] invalid key")

export const endpoint = process.env.NODEOS_ENDPOINT;
export const actor = process.env.ACTOR || 'blocktivity1';
export const permission = process.env.PERMISSION || 'push';
export const VERSION = Number(process.env.VERSION || 1);
export const network = process.env.NETWORK;
export const COSIGN = process.env.COSIGN || '';

export const signatureProvider = new JsSignatureProvider((process.env.PRIVATE_KEYS || "").split(","));
export const rpc = new JsonRpc(endpoint, { fetch });
export const api = new Api({ rpc: new JsonRpc(endpoint, { fetch }), signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
export let authorization: Authorization[] = [];

if (COSIGN) {
  const [cosign_actor, cosign_permission] = COSIGN.split("@");
  authorization.push({ actor: cosign_actor, permission: cosign_permission })
}
authorization.push({ actor, permission })

export const ONE_HOUR = Number(process.env.ONE_HOUR || 60 * 60 * 2); // 1 hour
export const PAUSE_MS = Number(process.env.PAUSE_MS || 60 * 1000); // 1 minute
export const CONCURRENCY = Number(process.env.CONCURRENCY) || 3;
