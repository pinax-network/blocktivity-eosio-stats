#!/bin/bash

curl --request POST \
  --url http://api.eosn.io/v1/chain/get_table_rows \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"code":"blocktivity1","table":"sum","scope":"blocktivity1","json":true}' | jq .
