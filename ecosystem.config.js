module.exports = {
  apps: [
    {
      name: "blocktivity-eos-stats",
      script: 'index.ts',
      env: {
        NODEOS_ENDPOINT: "https://api.eosn.io",
        ACCOUNT_NAME: "blocktivity1",
        PERMISSION: "ops",
      },
      autorestart: true,
      log_date_format : "YYYY-MM-DD HH:mm"
    }
  ]
};
