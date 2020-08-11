const ShioriConfig = require("../Shiori/ShioriConfig");

const subsystems = {
  "mysql": require("./subsystems/MySQLSubsystem")
};

var DBSubsystem = null;

function Init() {
  DBSubsystem = new subsystems[ShioriConfig.database.subsystem.toLowerCase()];

  DBSubsystem.databaseHost = ShioriConfig.database.host;
  DBSubsystem.databasePort = ShioriConfig.database.port;
  DBSubsystem.databaseUser = ShioriConfig.database.username;
  DBSubsystem.databasePassword = ShioriConfig.database.password;
  DBSubsystem.database = ShioriConfig.database.database;
}

function GetSubsystem() {
  if(DBSubsystem == null) Init();
  return DBSubsystem;
}

module.exports = {
  Init,
  GetSubsystem
};
