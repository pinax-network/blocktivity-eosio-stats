#!/bin/bash

cleos system newaccount eosio blocktivity EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV --stake-cpu "1000.0000 EOS" --stake-net "100.0000 EOS" --buy-ram-kbytes 2000 --transfer
cleos set contract blocktivity . blocktivity.wasm blocktivity.abi
cleos push action blocktivity push '[86666400, "2019-11-03T16:48:21", 139430, 2951607, 452098507, 27470669]' -p blocktivity
