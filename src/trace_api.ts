import fetch from "node-fetch"
import { endpoint } from "./config";
import { Block } from "./interfaces";
import { timeout } from "./utils";

// v1/trace_api/get_block
export async function get_block( block_num?: number ): Promise<Block> {
    try {
        const params = {method: "POST", body: JSON.stringify({block_num}) };
        const response = await fetch(endpoint + "/v1/trace_api/get_block", params);
        const block: Block = await response.json();
        return block;
    } catch (e) {
        console.error("[ERROR] missing block - paused 1s", block_num);
        await timeout(1000); // pause for 1s
        return get_block( block_num );
    }
}

// (async () => {
//     console.log(await get_block(39381711));
// })()