import * as path from "path";
import * as fs from "fs";
import { rpc, rpc_history, client, ONE_HOUR } from "./src/config";
import { timeout } from "./src/utils";
import { Count } from "./src/interfaces";
import * as write from "write-json-file";
import PQueue from 'p-queue';
import moment from "moment";

// global timer
let before = moment.utc(moment.now()).unix();

async function main() {
  const block_num = await get_last_hour_block();

  if ( !exists(block_num) ) {
    const hourly_counts = await get_hourly_counts( block_num ); // fetch hourly count data
    save( block_num, hourly_counts ); // save locally as JSON
  } else {
    console.log(block_num, 'already exists');
  }
  await timeout(60000); // 1 minute pause
  main();
}
main();

function exists( block_num: number ) {
  return fs.existsSync(path.join(__dirname, "tmp", block_num + ".json"));
}

function save( block_num: number, json: any ) {
  write.sync(path.join(__dirname, "tmp", block_num + ".json"), json);
}

async function get_last_hour_block() {
  const { last_irreversible_block_num } = await rpc.get_info();

  // minus 1 hour & round down to the nearest 1 hour interval
  return (last_irreversible_block_num - ONE_HOUR) - last_irreversible_block_num % ONE_HOUR;
}

async function get_hourly_counts( block_num: number ) {
  before = moment.utc(moment.now()).unix();
  const hourly_counts: Count = {
    actions: 0,
    transactions: 0,
  }
  // queue up promises
  const queue = new PQueue({concurrency: 20});

  for (let i = block_num; i < block_num + ONE_HOUR; i++) {
    queue.add(async () => {
      const block_counts = await get_block_counts( i )
      hourly_counts.actions += block_counts.actions;
      hourly_counts.transactions += block_counts.transactions;

      // logging
      const after = moment.utc(moment.now()).unix();
      console.log(JSON.stringify({time: after - before, block_num, delta_num: ONE_HOUR - i % ONE_HOUR, block_counts}));
    });
  }

  // wait until queue is finished
  await queue.onIdle();

  // logging
  const after = moment.utc(moment.now()).unix();
  console.log(JSON.stringify({time: after - before, block_num, hourly_counts}));
  return hourly_counts;
}

async function get_block_counts( block_num: number, retry = 3 ): Promise<Count> {

  let block: any;

  if (retry <= 0) {
    console.error("[ERROR] missing block", block_num);
    process.exit();
  }

  try {
    // get block info
    block = await rpc.get_block( block_num );
  } catch (e) {
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
      block_counts.actions += await get_dfuse_actions_count( trx );
    }
  }
  return block_counts;
}

async function get_v1_actions_count( trx: string, retry = 3 ): Promise<number> {
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

async function get_dfuse_actions_count( trx: string, retry = 3 ): Promise<number> {
  if (retry <= 0) {
    console.error(JSON.stringify({error: "missing trx in v1 History", trx}));
    return 0;
  }
  try {
    const {transaction} = await client.fetchTransaction( trx );
    return transaction.actions.length;
  } catch (e) {
    return get_dfuse_actions_count( trx, retry - 1 )
  }
}