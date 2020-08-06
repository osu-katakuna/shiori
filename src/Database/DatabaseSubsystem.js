class DatabaseSubsystem {
  constructor() {
    this.connectionInstance = null;

    this.database = "database";
    this.databaseHost = "localhost";
    this.databasePort = "port";
    this.databaseUser = "database";
    this.databasePassword = "database";
  }

  get Connected() {
    return this.connectionInstance != null;
  }

  Connect() {
    throw new Exception("not implemented");
  }

  Query(q, ...values) {
    throw new Exception("not implemented");
  }

  Close() {
    throw new Exception("not implemented");
  }
}

module.exports = DatabaseSubsystem;
