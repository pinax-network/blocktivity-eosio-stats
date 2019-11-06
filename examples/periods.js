const fetch = require("node-fetch");
const { JsonRpc } = require("eosjs");

const rpc = new JsonRpc("https://api.eosn.io", { fetch });

const code = "blocktivity1";
const scope = "blocktivity1";
const table = "periods";
const limit = 168

rpc.get_table_rows({ json: true, code, scope, table, limit }).then((data => {

  for (const row of data.rows) {
    console.log(row);
    // { block_num: 88228800,
    //   timestamp: '2019-11-05T02:35:49',
    //   transactions: 178877,
    //   actions: 826073,
    //   cpu_usage_us: 316587911,
    //   net_usage_words: 8364304 }
  }
}))

