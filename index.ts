import { streamBlocks } from "./src/dfuse";

let actions = 0;
let transactions = 0;
const HOUR = 7200;
const start_block_num = 246272572 - HOUR;
const stop_block_num = start_block_num + HOUR;

function callback(block: any) {
    const block_num = block.number;
    const timestamp = Number(block.header.timestamp.seconds);

    actions += block.filteredExecutedTotalActionCount;
    transactions += block.filteredTransactionCount;
    console.log({timestamp, remaining: stop_block_num - block_num, block_num, actions, transactions})
}

(async () => {
    await streamBlocks(start_block_num, stop_block_num, callback);
    console.log("done");
})();