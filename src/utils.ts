import * as path from "path";
import * as fs from "fs";
import * as write from "write-json-file";
import * as load from "load-json-file";
import { RpcError } from 'eosjs';
import { api, actor, network, authorization } from "./config";
import { Count } from "./interfaces";
import { Action } from "eosjs/dist/eosjs-serialize";

export function timeout(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(true);
    }, ms);
  })
}

export function parseTimestamp( timestamp: string ) {
  return timestamp.split(".")[0];
}

export function push( data: Count ): Action {
  return {
    account: actor,
    name: "push",
    authorization,
    data
  }
}

/**
 * Transaction
 */
export async function transact(actions: Action[]) {
  try {
      const result = await api.transact({actions}, { blocksBehind: 3, expireSeconds: 30 });
      const trx_id = result.transaction_id;
      for (const { account, name, data } of actions) {
          console.log(JSON.stringify({account, name, trx_id, data}));
      }
  } catch (e) {
      if (e instanceof RpcError) {
          const {name, what, details} = e.json.error
          const message = (details[0]) ? details[0].message : `[${name}] ${what}`;
          throw new Error(message);
      } else {
        console.error(e);
      }
  }
}

export function exists( block_num: number ) {
  return fs.existsSync(path.join(process.cwd(), "tmp", `${network}-${block_num}.json`));
}

export function save_local( block_num: number, json: Count ) {
  write.sync(path.join(process.cwd(), "tmp", `${network}-${block_num}.json`), json);
}

export async function save( block_num: number, json: Count, retry = 10): Promise<void> {
  save_local( block_num, json );

  if (retry <= 0) {
    console.error(JSON.stringify({error: "failed to push on-chain", block_num, json}));
    return;
  }

  // push on-chain
  try {
    await transact([ push(json) ])
  } catch (e) {
    console.error(JSON.stringify({error: "save", message: e}));
    await timeout(5000) // 5 sec pause
    return save( block_num, json, retry - 1);
  }
}

export function loads( block_num: number ): Count {
  return load.sync(path.join(process.cwd(), "tmp", `${network}-${block_num}.json`));
}
