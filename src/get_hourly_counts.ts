import moment from "moment";
import PQueue from 'p-queue';
import { Count, Block } from "./interfaces";
import { rpc, ONE_HOUR, CONCURRENCY, actor } from "./config";
import { parseTimestamp, timeout } from "./utils";
import { get_block } from "./trace_api";

// global timer
let before = moment.utc(moment.now()).unix();

export async function get_hourly_counts( block: Block ) {
  const start_block = block.number;
  before = moment.utc(moment.now()).unix();

  const hourly_counts: Count = {
    block_num: block.number,
    timestamp: parseTimestamp(block.timestamp),
    actions: 0,
    transactions: 0,
    cpu_usage_us: 0,
    net_usage_words: 0,
  }
  // queue up promises
  const queue = new PQueue({concurrency: CONCURRENCY});

  for (let i = start_block; i < start_block + ONE_HOUR; i++) {
    queue.add(async () => {
      const block = await get_block(i);
      const block_counts = get_block_counts( block )
      hourly_counts.actions += block_counts.actions;
      hourly_counts.transactions += block_counts.transactions;
      hourly_counts.cpu_usage_us += block_counts.cpu_usage_us;
      hourly_counts.net_usage_words += block_counts.net_usage_words;

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

export function get_block_counts( block: Block ): Count {
  // store statistic counters
  const block_counts: Count = {
    block_num: block.number,
    timestamp: parseTimestamp(block.timestamp),
    actions: 0,
    transactions: 0,
    cpu_usage_us: 0,
    net_usage_words: 0,
  }

  // count each transaction
  for ( const { cpu_usage_us, net_usage_words, actions } of block.transactions ) {
    block_counts.transactions += 1;
    block_counts.cpu_usage_us += cpu_usage_us;
    block_counts.net_usage_words += net_usage_words;
    block_counts.actions += actions.length;
  }
  return block_counts;
}

export async function get_last_hour_block(): Promise<number> {
  try {
    const { last_irreversible_block_num } = await rpc.get_info();

    // minus 1 hour & round down to the nearest 1 hour interval
    return (last_irreversible_block_num - ONE_HOUR) - last_irreversible_block_num % ONE_HOUR;
  } catch (e) {
    console.error("[ERROR] ❗️ get info");
    await timeout(5000) // pause for 5s
  }
  return get_last_hour_block();
}

export async function get_existing_block_nums(): Promise<Set<number>> {
  const { rows } = await rpc.get_table_rows({ json: true, code: actor, table: "periods", scope: actor, limit: 200 })

  return new Set<number>(rows.map((i: any) => i.block_num));
}
