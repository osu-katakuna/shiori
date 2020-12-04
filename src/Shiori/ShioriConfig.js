const shioriDefaultConfiguration = {
  server: {
    ssl: {
      enabled: false,
      key: "/path/to/key.pem",
      cert: "/path/to/cacert.pem"
    },
    port: 8080,
    isUnderProxy: false
  },
  database: {
    subsystem: "mysql",
    host: "localhost",
    port: 3306,
    username: "katakuna",
    password: "katakuna",
    database: "katakuna"
  },
  redis: {
    enabled: true,
    host: "localhost",
    port: 6379,
    password: null
  }
};

var ConfigManager = new (require('../ConfigManager'))("shiori", shioriDefaultConfiguration);

module.exports = ConfigManager;
