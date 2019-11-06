const fetch = require("node-fetch");
const { JsonRpc } = require("eosjs");

const rpc = new JsonRpc("https://api.eosn.io", { fetch });

const code = "blocktivity1";
const scope = "blocktivity1";
const table = "sum";

rpc.get_table_rows({ json: true, code, scope, table }).then((data => {
  console.log(data.rows[0]);
  // { hour: 815997,
  //   day: 20310523,
  //   week: 128191484,
  //   last_updated: '2019-11-06T15:48:24' }
}))

