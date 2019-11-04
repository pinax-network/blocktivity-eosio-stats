# Blocktivity EOSIO Stats

1. Server-Side: Calculate action & transaction counts
2. Smart Contract: Hourly/Daily/Weekly statistics

## Chains

- [EOS](https://bloks.io/account/blocktivity1)

## History solution (required)

- [Dfuse](https://www.dfuse.io/en)
- [EOSIO v1 History](https://developers.eos.io/eosio-nodeos/reference)
- [Hyperion](https://github.com/eosrio/Hyperion-History-API)

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
      "timestamp": "2019-11-03T16:48:21",
      "transactions": 379379,
      "actions": 1211942,
      "cpu_usage_us": 63476,
      "net_usage_words": 1772
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
      "hour": 875365,
      "day": 20773084,
      "week": 83237200,
      "timestamp": "2019-11-03T16:48:21"
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

## TABLE

- [`periods`](#table-periods)
- [`sum`](#table-sum)
- [`average`](#table-average)
- [`record`](#table-record)

## ACTION `push`

Pushes hourly (7200 blocks) statistics of transaction & action counts.

- Authority:  `get_self()`

### params

- `{uint64_t} block_num` - block number start (rounded to the nearest 7200 interval)
- `{time_point_sec} timestamp` - block creation timestamp (UTC)
- `{uint64_t} transactions` - number of actions during 1 hour period
- `{uint64_t} actions` - number of transactions during 1 hour period

### example

```bash
cleos push action blocktivity push '[87458400, "2019-11-03T16:48:21", 299282, 281802]' -p blocktivity
```

## TABLE `periods`

- `{uint64_t} block_num` - start of block number
- `{time_point_sec} timestamp` - block creation timestamp (UTC)
- `{uint64_t} transactions` - number of actions during 1 hour period
- `{uint64_t} actions` - number of transactions during 1 hour period
- `{uint64_t} cpu_usage_us` - number of cpu_usage_us during 1 hour period
- `{uint64_t} net_usage_words` - number of net_usage_words during 1 hour period

### example

```json
{
  "block_num": 87458400,
  "timestamp": "2019-11-03T16:48:21",
  "transactions": 299282,
  "actions": 281802,
  "cpu_usage_us": 63476,
  "net_usage_words": 1772
}
```

## TABLE `sum`

- `{uint64_t} hour` - hourly number of actions
- `{uint64_t} day` - daily number of actions
- `{uint64_t} week` - weekly number of actions
- `{time_point_sec} last_updated` - last updated (UTC)

### example

```json
{
  "hour": 875365,
  "day": 20773084,
  "week": 83237200,
  "last_updated": "2019-11-03T16:48:21"
}
```

## TABLE `average`

- `{uint64_t} hour` - average hourly number of actions (7 day average)
- `{uint64_t} day` - average daily number of actions (7 day average)
- `{uint64_t} week` - weekly number of actions
- `{time_point_sec} last_updated` - last updated (UTC)

### example

```json
{
  "hour": 875365,
  "day": 20773084,
  "week": 83237200,
  "last_updated": "2019-11-03T16:48:21"
}
```

## TABLE `record`

- `{uint64_t} hour` - highest hourly number of actions
- `{uint64_t} day` - highest daily number of actions
- `{uint64_t} week` - highest weekly number of actions
- `{time_point_sec} last_updated` - last updated (UTC)

### example

```json
{
  "hour": 875365,
  "day": 20773084,
  "week": 83237200,
  "last_updated": "2019-11-03T16:48:21"
}
```