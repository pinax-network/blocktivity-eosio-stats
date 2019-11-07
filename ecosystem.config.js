module.exports = {
  apps: [
    {
      name: "blocktivity-eos-stats",
      script: 'index.ts',
      env: {
        NODEOS_ENDPOINT: "http://eos.eosn.io",
        HISTORY_TYPE: "dfuse",
        NETWORK: "mainnet"
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    },
    {
      name: "blocktivity-jungle-stats",
      script: 'index.ts',
      env: {
        NODEOS_ENDPOINT: "http://jungle.eosn.io",
        HISTORY_TYPE: "dfuse",
        NETWORK: "jungle"
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    },
    {
      name: "blocktivity-kylin-stats",
      script: 'index.ts',
      env: {
        NODEOS_ENDPOINT: "http://kylin.eosn.io",
        HISTORY_TYPE: "dfuse",
        NETWORK: "kylin"
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    },
    {
      name: "blocktivity-bos-stats",
      script: 'index.ts',
      env: {
        NODEOS_ENDPOINT: "http://bos.eosn.io",
        HISTORY_TYPE: "v1",
        NODEOS_HISTORY_ENDPOINT: "http://api.bossweden.org"
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    },
    {
      name: "blocktivity-wax-stats",
      script: 'index.ts',
      env: {
        NODEOS_ENDPOINT: "http://wax.eosn.io",
        HISTORY_TYPE: "dfuse",
        NETWORK: "wax"
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    },
    {
      name: "blocktivity-meetone-stats",
      script: 'index.ts',
      env: {
        NODEOS_ENDPOINT: "http://meetone.eosn.io",
        HISTORY_TYPE: "v1",
        NODEOS_HISTORY_ENDPOINT: "https://fullnode.meet.one",
        ACTOR: "blocktivit.m"
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    },
    {
      name: "blocktivity-eos-history",
      script: 'history.ts',
      env: {
        NODEOS_ENDPOINT: "http://eos.eosn.io",
        HISTORY_TYPE: "dfuse",
        NETWORK: "mainnet"
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    },
    {
      name: "blocktivity-jungle-history",
      script: 'history.ts',
      env: {
        NODEOS_ENDPOINT: "http://jungle.eosn.io",
        HISTORY_TYPE: "dfuse",
        NETWORK: "jungle"
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    },
    {
      name: "blocktivity-kylin-history",
      script: 'history.ts',
      env: {
        NODEOS_ENDPOINT: "http://kylin.eosn.io",
        HISTORY_TYPE: "dfuse",
        NETWORK: "kylin"
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    },
    {
      name: "blocktivity-bos-history",
      script: 'history.ts',
      env: {
        NODEOS_ENDPOINT: "http://bos.eosn.io",
        HISTORY_TYPE: "v1",
        NODEOS_HISTORY_ENDPOINT: "http://api.bossweden.org"
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    },
    {
      name: "blocktivity-wax-history",
      script: 'history.ts',
      env: {
        NODEOS_ENDPOINT: "http://wax.eosn.io",
        HISTORY_TYPE: "dfuse",
        NETWORK: "wax"
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    },
    {
      name: "blocktivity-meetone-history",
      script: 'history.ts',
      env: {
        NODEOS_ENDPOINT: "http://meetone.eosn.io",
        HISTORY_TYPE: "v1",
        NODEOS_HISTORY_ENDPOINT: "https://fullnode.meet.one",
        ACTOR: "blocktivit.m"
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    }
  ]
};
