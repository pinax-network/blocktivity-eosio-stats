module.exports = {
  apps: [
    {
      name: "blocktivity-eos-stats",
      script: 'index.ts',
      env: {
        NODEOS_ENDPOINT: "http://eos.eosn.io",
        NODEOS_ENDPOINT_HISTORY: "http://eos.greymass.com",
        ACTOR: "blocktivity1",
        PERMISSION: "push",
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    },
    {
      name: "blocktivity-eos-stats-history",
      script: 'history.ts',
      env: {
        NODEOS_ENDPOINT: "http://eos.eosn.io",
        NODEOS_ENDPOINT_HISTORY: "http://eos.greymass.com",
        ACTOR: "blocktivity1",
        PERMISSION: "push",
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    }
  ]
};
