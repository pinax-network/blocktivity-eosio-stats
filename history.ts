
import { ONE_HOUR, rpc, actor } from "./src/config";
import { get_last_hour_block, get_hourly_counts } from "./src/get_hourly_counts";
import { exists, save, push, transact, loads } from "./src/utils";

async function history() {
  const block_num = await get_last_hour_block();
  const block_nums = await get_existing_block_nums();
  // get last week
  for (let i = 168; i > 0; i--) {
    const history_block_num = block_num - i * ONE_HOUR;

    if (block_nums.has(history_block_num)) {
      console.log("SKIPP", history_block_num);
      continue;
    }

    if ( !exists(history_block_num) ) {
      const hourly_counts = await get_hourly_counts( history_block_num ); // fetch hourly count data
      await save( history_block_num, hourly_counts ); // save locally as JSON
    } else {
      const hourly_counts = loads( history_block_num );
      try {
        await transact([ push( hourly_counts ) ])
      } catch (e) {
        console.error(e);
      }
      console.log(JSON.stringify({history_block_num, exists: true}));
    }
  }
}
history();

async function get_existing_block_nums(): Promise<Set<number>> {
  const { rows } = await rpc.get_table_rows({ json: true, code: actor, table: "periods", scope: actor, limit: 200 })

  return new Set<number>(rows.map((i: any) => i.block_num));
}