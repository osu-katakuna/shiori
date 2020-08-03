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
    host: "localhost",
    port: 3306,
    username: "katakuna",
    password: "katakuna",
    database: "katakuna"
  }
};

var ConfigManager = new (require('../ConfigManager'))("shiori", shioriDefaultConfiguration);

module.exports = ConfigManager;
