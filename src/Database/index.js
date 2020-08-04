const ShioriConfig = require("../Shiori/ShioriConfig");

const subsystems = {
  "mysql": require("./subsystems/MySQLSubsystem")
};

var DBSubsystem = null;

function Init() {
  DBSubsystem = new subsystems[ShioriConfig.database.subsystem.toLowerCase()];
  console.log("DB SUBSYSTEM INIT:", DBSubsystem);
}

function GetSubsystem() {
  if(DBSubsystem == null) Init();
  return DBSubsystem;
}

module.exports = {
  Init,
  GetSubsystem
};
