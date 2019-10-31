import { rpc_history, client, hyperion, HISTORY_TYPE } from "./config";

export async function get_transaction_count( trx: string ) {
  switch (HISTORY_TYPE) {
    case "dfuse": return get_dfuse_actions_count( trx )
    case "hyperion": return get_hyperion_actions_count( trx )
    case "v1": return get_v1_actions_count( trx )
    default: return get_v1_actions_count( trx )
  }
}

export async function get_v1_actions_count( trx: string, retry = 3 ): Promise<number> {
  if (retry <= 0) {
    console.error(JSON.stringify({error: "missing trx in v1 History", trx}));
    return 0;
  }
  try {
    const { traces } = await rpc_history.history_get_transaction( trx );
    return traces.length;
  } catch (e) {
    return get_v1_actions_count( trx, retry - 1 )
  }
}

export async function get_dfuse_actions_count( trx: string, retry = 3 ): Promise<number> {
  if (retry <= 0) {
    console.error(JSON.stringify({error: "missing trx in Dfuse History", trx}));
    return 0;
  }
  try {
    const {transaction} = await client.fetchTransaction( trx );
    return transaction.actions.length;
  } catch (e) {
    return get_dfuse_actions_count( trx, retry - 1 )
  }
}

export async function get_hyperion_actions_count( trx: string, retry = 3 ): Promise<number> {
  if (retry <= 0) {
    console.error(JSON.stringify({error: "missing trx in Hyperion History", trx}));
    return 0;
  }
  try {
    const { actions } = await hyperion.get_transaction( trx );
    return actions.length;
  } catch (e) {
    return get_hyperion_actions_count( trx, retry - 1 )
  }
}