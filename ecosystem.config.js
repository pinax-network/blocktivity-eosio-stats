module.exports = {
  apps: [
    {
      name: "blocktivity-eos-stats",
      script: 'src/index.ts',
      env: {
        NODEOS_ENDPOINT: "http://eos.eosn.io",
        HISTORY_TYPE: "dfuse",
        NETWORK: "mainnet",
        COSIGN: "proxy4nation@payforcpu"
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    },
    {
      name: "blocktivity-jungle-stats",
      script: 'src/index.ts',
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
      script: 'src/index.ts',
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
      script: 'src/index.ts',
      env: {
        NODEOS_ENDPOINT: "http://bos.eosn.io",
        HISTORY_TYPE: "v1",
        NODEOS_ENDPOINT_HISTORY: "http://api.bossweden.org",
        NETWORK: "bos"
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    },
    {
      name: "blocktivity-wax-stats",
      script: 'src/index.ts',
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
      script: 'src/index.ts',
      env: {
        NODEOS_ENDPOINT: "http://meetone.eosn.io",
        HISTORY_TYPE: "v1",
        NODEOS_ENDPOINT_HISTORY: "https://fullnode.meet.one",
        ACTOR: "blocktivit.m",
        NETWORK: "meetone"
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    },
    {
      name: "blocktivity-telos-stats",
      script: 'src/index.ts',
      env: {
        NODEOS_ENDPOINT: "http://telosapi.atticlab.net",
        HISTORY_TYPE: "v1",
        NODEOS_ENDPOINT_HISTORY: "http://telosapi.atticlab.net",
        ACTOR: "blocktivity1",
        NETWORK: "telos",
        VERSION: 1
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    }
  ]
};
