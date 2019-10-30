import { rpc, hyperion } from "./src/config";
import pAll from 'p-all';
import PQueue from 'p-queue';
import moment from "moment";

interface Count {
  actions: number;
  transactions: number;
}

(async () => {
  const before = moment.utc(moment.now()).unix();

  // get latest block number
  // const { last_irreversible_block_num } = await rpc.get_info();

  const last_irreversible_block_num = 87166536;
  const hourly_counts = await get_hourly_counts( last_irreversible_block_num );

  const after = moment.utc(moment.now()).unix();
  console.log(`time ${after - before}s`, hourly_counts);
})();

async function get_hourly_counts( block_num: number ) {
  const ONE_HOUR = 60 * 60 * 2; // 60 seconds

  // minus 1 hour & round down to the nearest 1 hour interval
  const first_hour_block = (block_num - ONE_HOUR) - block_num % ONE_HOUR;

  const hourly_counts: Count = {
    actions: 0,
    transactions: 0,
  }
  // queue up promises
  const queue = new PQueue({concurrency: 20});

  for (let i = first_hour_block; i < first_hour_block + ONE_HOUR; i++) {
    queue.add(async () => {
      const block_counts = await get_block_counts( i )
      hourly_counts.actions += block_counts.actions;
      hourly_counts.transactions += block_counts.transactions;
    });
  }

  console.log(block_num, hourly_counts);
  await queue.onIdle();
  return hourly_counts;
}

async function get_block_counts( block_num: number, retry = 3 ): Promise<Count> {

  let block: any;

  try {
    // get block info
    block = await rpc.get_block( block_num );
  } catch (e) {
    console.error("error", block_num);
    return get_block_counts( block_num, retry - 1 );
  }

  // store statistic counters
  const block_counts = {
    actions: 0,
    transactions: 0,
  }

  // count each transaction
  for ( const { trx } of block.transactions ) {
    block_counts.transactions += 1;

    // full trace in block
    if (typeof(trx) == "object") {
      block_counts.actions += trx.transaction.actions.length;
    // traces executed by smart contract
    // must fetch individual transaction
    } else {
      /**
       * TO-DO
       *
       * Hyperion is too slow & unreliable to fetch additional transactions
       */
      // block_counts.actions += await get_hyperion_actions_count( trx );
    }
  }
  console.log(block_num, block_counts);
  return block_counts;
}

async function get_hyperion_actions_count( trx: string, retry = 3 ): Promise<number> {
  if (retry > 0) {
    try {
      const transaction = await hyperion.get_transaction( trx );
      return transaction.actions.length;
    } catch (e) {
      return get_hyperion_actions_count( trx, retry - 1 )
    }
  }
  return 0;
}
