import { RpcError } from 'eosjs';
import { api } from "./config";
import { Action } from "./interfaces";

export function timeout(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve();
    }, ms);
  })
}

/**
 * Transaction
 */
export async function transact(actions: Action[]) {
  try {
      const result = await api.transact({actions}, { blocksBehind: 3, expireSeconds: 30 });
      const trx_id = result.transaction_id;
      for (const action of actions) {
          console.log(`${action.account}::${action.name} [${JSON.stringify(action.data)}] => ${trx_id}`);
      }
  } catch (e) {
      if (e instanceof RpcError) {
          const {name, what, details} = e.json.error
          const message = (details[0]) ? details[0].message : `[${name}] ${what}`;
          console.error(message);
      }
  }
}