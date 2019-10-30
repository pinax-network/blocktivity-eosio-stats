import { rpc, hyperion } from "./src/config";
import PQueue from 'p-queue';
import moment from "moment";

interface Count {
  actions: number;
  transactions: number;
}

(async () => {
  const before = moment.utc(moment.now()).unix();

  // get latest block number
  const { last_irreversible_block_num } = await rpc.get_info();
  const hourly_counts = await get_hourly_counts( last_irreversible_block_num );

  const after = moment.utc(moment.now()).unix();
  console.log(`time ${after - before}s`, hourly_counts);
})();

async function get_hourly_counts( block_num: number ) {
  const ONE_HOUR = 60 * 2; // 1 minutes

  // minus 1 hour & round down to the nearest 1 hour interval
  const first_hour_block = (block_num - ONE_HOUR) - block_num % ONE_HOUR;

  const hourly_counts: Count = {
    actions: 0,
    transactions: 0,
  }
  // queue up promises
  const queue = new PQueue({concurrency: 10});
  for (let i = first_hour_block; i < first_hour_block + ONE_HOUR; i++) {
    const block_counts = await queue.add(() => get_block_counts( i ));
    hourly_counts.actions += block_counts.actions;
    hourly_counts.transactions += block_counts.transactions;
  }

  console.log(block_num, hourly_counts);
  return hourly_counts;
}

async function get_block_counts( block_num: number ) {

  // get block info
  const block: any = await rpc.get_block( block_num );

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
      const transaction = await hyperion.get_transaction( trx );
      block_counts.actions += transaction.actions.length;
    }
  }
  console.log(block_num, block_counts);
  return block_counts;
}