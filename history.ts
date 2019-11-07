
import { ONE_HOUR } from "./src/config";
import { get_last_hour_block, get_hourly_counts, get_block, get_existing_block_nums } from "./src/get_hourly_counts";
import { exists, save, push, transact, loads } from "./src/utils";

export async function history() {
  const block_num = await get_last_hour_block();
  const block_nums = await get_existing_block_nums();

  // get last week
  for (let i = 168; i > 0; i--) {
    const history_block_num = block_num - i * ONE_HOUR;

    if (block_nums.has(history_block_num)) {
      console.log("SKIPP", history_block_num);
      continue;
    }

    if ( !exists( history_block_num ) ) {
      const hourly_counts = await get_hourly_counts( await get_block( history_block_num) ); // fetch hourly count data
      await save( history_block_num, hourly_counts ); // save locally as JSON
    } else {
      const hourly_counts = loads( history_block_num );
      hourly_counts.block_num = history_block_num;

      await transact([ push( hourly_counts ) ]);
      console.log(JSON.stringify({history_block_num, exists: true}));
    }
  }
}

// (async () => {
//   await history();
// })

