# Blocktivity EOS Stats

1. Calculate action & transaction server-side process
2. Data publishing solution using EOSIO based smart contract

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

## TABLE `hours` & `days` & `weeks`

- `{uint64_t} block_num` - block number start
- `{time_point_sec} timestamp` - Timestamp based on Block Number
- `{uint64_t} transactions` - number of actions during period
- `{uint64_t} actions` - number of transactions during period

### example

```json
{
  "block_num": 87458400,
  "timestamp": "2019-08-07T18:37:37",
  "transactions": 299282,
  "actions": 281802
}
```
