import * as dotenv from "dotenv"
import { Authorization } from "./interfaces";
import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsonRpc as HyperionRpc } from "@eoscafe/hyperion";
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
const { TextEncoder, TextDecoder } = require('util');

dotenv.config();

const fetch = require('node-fetch');

export const endpoint = process.env.NODEOS_ENDPOINT || 'https://api.eosn.io';
export const contract = process.env.CONTRACT || 'blocktivity1';
export const actor = process.env.ACTOR || 'eosnationftw';
export const permission = process.env.PERMISSION || 'push';

// export const signatureProvider = new JsSignatureProvider([process.env.PRIVATE_KEY || '']);
export const rpc = new JsonRpc(endpoint, { fetch });
export const hyperion = new HyperionRpc(endpoint, { fetch })
// export const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

export const authorization: Authorization[] = [{
  actor,
  permission,
}];