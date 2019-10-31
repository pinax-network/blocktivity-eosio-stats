import { RpcError } from 'eosjs';
import { api, authorization, actor } from "./config";
import { Action, Count } from "./interfaces";

export function timeout(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve();
    }, ms);
  })
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
          console.error(message);
      }
  }
}