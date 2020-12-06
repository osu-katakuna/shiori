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
    throw new Error("not implemented");
  }

  Query(q, ...values) {
    throw new Error("not implemented");
  }

  Close() {
    throw new Error("not implemented");
  }
}

module.exports = DatabaseSubsystem;
