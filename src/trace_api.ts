import fetch from "node-fetch"
import { endpoint } from "./config";
import { Block } from "./interfaces";
import { timeout } from "./utils";

interface BlockError {
    code: number;
    message: string;
    error: {
        code: number;
        name: string;
        what: string;
        details: {message: string}[];
    }
}

// v1/trace_api/get_block
export async function get_block( block_num?: number, retry = 3 ): Promise<Block> {
    retry -= 1;
    if ( retry < 0 ) {
        console.error(`[ERROR] ❌ trace API critical error [${block_num}] - max retries`);
        process.exit();
    }
    try {
        const params = {method: "POST", body: JSON.stringify({block_num_or_id: block_num }) };
        const response = await fetch(endpoint + "/v1/chain/get_block", params);
        const block: any = await response.json();
        if ( block.error ) {
            console.error(`[ERROR] ❗️ trace API error [${block_num}] -`, block.message);
            await timeout(1000); // pause for 1s
            return get_block( block_num, retry );
        }
        return block;
    } catch (e) {
        console.error(`[ERROR] ❗️ trace API error [${block_num}]`);
        await timeout(1000); // pause for 1s
        return get_block( block_num );
    }
}

// (async () => {
//     console.log(await get_block(39381711));
// })()