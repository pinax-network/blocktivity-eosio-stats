import { Count, Block } from "./interfaces";
import { rpc, ONE_HOUR, CONCURRENCY, actor } from "./config";
import { timeout } from "./utils";
import PQueue from 'p-queue';
import { get_transaction_count } from "./get_transaction";
import moment from "moment";

// global timer
let before = moment.utc(moment.now()).unix();

export async function get_hourly_counts( block: Block ) {
  const start_block = block.block_num;
  before = moment.utc(moment.now()).unix();

  const hourly_counts: Count = {
    block_num: block.block_num,
    timestamp: block.timestamp,
    actions: 0,
    transactions: 0,
    cpu_usage_us: 0,
    net_usage_words: 0,
  }
  // queue up promises
  const queue = new PQueue({concurrency: CONCURRENCY});

  for (let i = start_block; i < start_block + ONE_HOUR; i++) {
    queue.add(async () => {
      const block_counts = await get_block_counts( await get_block(i) )
      hourly_counts.actions += block_counts.actions;
      hourly_counts.transactions += block_counts.transactions;

      // logging
      const after = moment.utc(moment.now()).unix();
      console.log(JSON.stringify({time: after - before, start_block, delta_num: ONE_HOUR - i % ONE_HOUR, block_counts}));
    });
  }

  // wait until queue is finished
  await queue.onIdle();

  // logging
  const after = moment.utc(moment.now()).unix();
  console.log(JSON.stringify({time: after - before, start_block, hourly_counts}));
  return hourly_counts;
}

export async function get_block( block_num: number ): Promise<Block> {
  try {
    const block: any = await rpc.get_block( block_num );
    return block;
  } catch (e) {
    console.error("[ERROR] missing block", block_num);
    await timeout(1000); // pause for 1s
    return get_block( block_num );
  }
}

export async function get_block_counts( block: Block ): Promise<Count> {
  // store statistic counters
  const block_counts: Count = {
    block_num: block.block_num,
    timestamp: block.timestamp,
    actions: 0,
    transactions: 0,
    cpu_usage_us: 0,
    net_usage_words: 0,
  }

  // count each transaction
  for ( const { trx, cpu_usage_us, net_usage_words } of block.transactions ) {
    block_counts.transactions += 1;
    block_counts.cpu_usage_us += cpu_usage_us;
    block_counts.net_usage_words += net_usage_words;

    // full trace in block
    if (typeof(trx) == "object") {
      block_counts.actions += trx.transaction.actions.length;
    // traces executed by smart contract
    // must fetch individual transaction
    } else {
      block_counts.actions += await get_transaction_count( trx );
    }
  }
  return block_counts;
}

export async function get_last_hour_block(): Promise<number> {
  try {
    const { last_irreversible_block_num } = await rpc.get_info();

    // minus 1 hour & round down to the nearest 1 hour interval
    return (last_irreversible_block_num - ONE_HOUR) - last_irreversible_block_num % ONE_HOUR;
  } catch (e) {
    console.error("[ERROR] get info");
    timeout(5 * 1000) // pause for 5s
  }
  return get_last_hour_block();
}

export async function get_existing_block_nums(): Promise<Set<number>> {
  const { rows } = await rpc.get_table_rows({ json: true, code: actor, table: "periods", scope: actor, limit: 200 })

  return new Set<number>(rows.map((i: any) => i.block_num));
}