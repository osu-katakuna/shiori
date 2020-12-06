const DatabaseSubsystem = require('../DatabaseSubsystem');
const MySQL = require('sync-mysql');

class MySQLSubsystem extends DatabaseSubsystem {
  Connect() {
    if(this.Connected) return;
    this.connectionInstance = new MySQL({
      host: this.databaseHost,
      user: this.databaseUser,
      password: this.databasePassword,
      database: this.database
    });
  }

  Query(q, ...values) {
    if(!this.Connected) this.Connect();
    return this.connectionInstance.query(q, values);
  }

  Close() {
    if(!this.Connected) return;
    this.connectionInstance.dispose();
    this.connectionInstance = null;
  }
}

module.exports = MySQLSubsystem;
