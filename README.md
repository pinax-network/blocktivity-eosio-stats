# Blocktivity EOSIO Stats

1. Server-Side: Calculate action & transaction counts
2. Smart Contract: Hourly/Daily/Weekly statistics

## Chains

- [EOS](https://bloks.io/account/blocktivity1)

### cURL - `periods`

Request **periods** (hourly intervals of 7200 blocks)

```bash
curl --request POST \
  --url http://api.eosn.io/v1/chain/get_table_rows \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"code":"blocktivity1","table":"periods","scope":"blocktivity1","json":true}'
```

> JSON response

```json
{
  "rows": [
    {
      "block_num": 87696000,
      "timestamp": "2019-11-02T01:54:29",
      "transactions": 379379,
      "actions": 1211942
    }
    ...
  ],
  "more": true
}
```

### cURL - `sum`

Request **sum** statistics

```bash
curl --request POST \
  --url http://api.eosn.io/v1/chain/get_table_rows \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"code":"blocktivity1","table":"sum","scope":"blocktivity1","json":true}'
```

> JSON response

```json
{
  "rows": [
    {
      "hour": 1211942,
      "day": 0,
      "week": 0
    }
  ],
  "more": false
}
```


# 1. Server-Side

## Install

```
$ git clone https://github.com/EOS-Nation/blocktivity-eos-stats.git
$ cd blocktivity-eos-stats
$ npm install
```

## Config

**.env**

```env
# Standard Nodeos
NODEOS_ENDPOINT="http://api.eosn.io"

# (Required) History Solution
HISTORY_TYPE="dfuse"
NODEOS_ENDPOINT_HISTORY="http://eos.greymass.com"
DFUSE_TOKEN="<PRIVATE DFUSE TOKEN>"

# (Optional) Push results to on-chain contract
NODEOS_ENDPOINT_CONTRACT="http://localhost:8888"
ACTOR="blocktivity1"
PERMISSION="push"
PRIVATE_KEY="<PRIVATE KEY>"

# (Optional) server-side settings
ONE_HOUR=7200
PAUSE_MS=60000
CONCURRENCY=3
```

## Quick Start

```bash
$ npm start
```

# 2. Smart Contract

## ACTION

- [`push`](#action-push)
- [`clean`](#action-clean)

## TABLE

- [`hours`](#table-hours)
- [`days`](#table-days)
- [`weeks`](#table-weeks)

## ACTION `push`

Pushes hourly (7200 blocks) statistics of transaction & action counts.

- Authority:  `get_self()`

### params

- `{uint64_t} block_num` - block number start (rounded to the nearest 7200 interval)
- `{uint64_t} transactions` - number of actions during 1 hour period
- `{uint64_t} actions` - number of transactions during 1 hour period

### example

```bash
cleos push action blocktivity push '[87458400, 299282, 281802]' -p blocktivity
```

## TABLE `hours`

- `{uint64_t} block_num` - start of block number
- `{uint64_t} transactions` - number of actions during 1 hour period
- `{uint64_t} actions` - number of transactions during 1 hour period

### example

```json
{
  "block_num": 87458400,
  "transactions": 299282,
  "actions": 281802
}
```

## TABLE `sum`

- `{uint64_t} hour` - hourly number of actions
- `{uint64_t} day` - daily number of actions
- `{uint64_t} week` - weekly number of actions
- `{uint64_t} block_num` - start of block number
- `{time_point_sec} timestamp` - last updated

### example

```json
{
  "hour": 123,
  "day": 123,
  "week": 123,
  "block_num": 87458400,
  "timestamp": "2019-08-07T18:37:37"
}
```