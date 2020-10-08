
import { ONE_HOUR } from "./config";
import { get_last_hour_block, get_hourly_counts, get_existing_block_nums } from "./get_hourly_counts";
import { exists, save, push, transact, loads } from "./utils";
import { get_block } from "./trace_api";

export async function history() {
  const block_num = await get_last_hour_block();
  const block_nums = await get_existing_block_nums();

  // get last week
  for (let i = 0; i < 167; i++) {
    const history_block_num = block_num - i * ONE_HOUR;

    if (block_nums.has(history_block_num)) {
      console.log("SKIP", history_block_num);
      continue;
    }

    if ( !exists( history_block_num ) ) {
      const hourly_counts = await get_hourly_counts( await get_block( history_block_num) ); // fetch hourly count data
      await save( history_block_num, hourly_counts ); // save locally as JSON
    } else {
      const hourly_counts = loads( history_block_num );
      hourly_counts.block_num = history_block_num;

      try {
        await transact([ push( hourly_counts ) ]);
        console.log(JSON.stringify({history_block_num, exists: true}));
      } catch (e) {
        console.error(e);
      }
    }
  }
  console.log(count);
}

(async () => {
  await history();
})()

