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
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || "katakuna",
    password: process.env.DB_PASSWORD || "katakuna",
    database: process.env.DB_DATABASE || "katakuna"
  },
  redis: {
    enabled: true,
    host: process.env.REDIS_HOST || "localhost",
    port: 6379,
    password: null
  }
};

var ConfigManager = new (require('../ConfigManager'))("shiori", shioriDefaultConfiguration);

module.exports = ConfigManager;
