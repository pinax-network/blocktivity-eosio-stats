import { rpc_history, client, hyperion, HISTORY_TYPE } from "./config";
import { ActionTrace } from "@dfuse/client";

export async function get_transaction_count( trx: string ) {
  switch (HISTORY_TYPE) {
    case "dfuse": return get_dfuse_actions_count( trx )
    case "hyperion": return get_hyperion_actions_count( trx )
    case "v1": return get_v1_actions_count( trx )
    default: return 0;
  }
}

export async function get_v1_actions_count( trx: string, retry = 3 ): Promise<number> {
  if (retry <= 0) {
    console.error(JSON.stringify({error: "missing trx in v1 History", trx}));
    return 0;
  }
  try {
    const { traces } = await rpc_history.history_get_transaction( trx );
    const global_sequences = new Map<number, string>();
    return count_action_traces(traces, global_sequences);
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
    const { execution_trace } = await client.fetchTransaction( trx );
    if (!execution_trace) return 0;
    const global_sequences = new Map<number, string>();
    const receipt = execution_trace.receipt;
    if ( receipt && ["canceled", "expired", "soft_fail", "hard_fail"].includes(receipt.status) ) return 0;
    return count_action_traces(execution_trace.action_traces, global_sequences);
  } catch (e) {
    return get_dfuse_actions_count( trx, retry - 1 )
  }
}

function count_action_traces( action_traces: ActionTrace<any>[], global_sequences: Map<number, string>): number {
  for ( const action of action_traces ) {
    global_sequences.set(Number(action.receipt.global_sequence), action.receipt.act_digest)
    if (action.inline_traces) count_action_traces(action.inline_traces, global_sequences)
  }
  // using Map to order the data using global_sequence
  // only count transactions that have different act_digest
  let count = 0;
  let last: string = "";
  for (const act_digest of global_sequences.values()) {
    if (act_digest != last) count += 1;
    last = act_digest;
  }
  return count;
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

(async () => {
  const count = await get_dfuse_actions_count("4cf4798a2d90a6e0faf0d0cd0e74013c962c35eadc71fffa2246576f01607fa0")
  console.log(count);
})();