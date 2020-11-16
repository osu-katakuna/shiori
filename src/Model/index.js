const DB = require("../Database").GetSubsystem();
const SQLEscape = require('sqlstring').escape;

class Model {
  constructor() {
    this.oldData = [];
    this.update = false;
  }

  static getTableName() {
    return this.table;
  }

  static all() {
    return DB.Query("SELECT * FROM " + this.table).map(u => {
      var i = new this();
      i.update = true;
      Object.keys(u).forEach(obj => { if(this.protected == null || this.protected.filter(x => x == obj).length == 0) {
        i[obj] = u[obj];
        i.oldData[obj] = u[obj];
      }});
      return i;
    });
  }

  static find(id, column = "id") {
    return DB.Query("SELECT * FROM " + this.table + " WHERE " + column + " = ?", id).map(u => {
      var i = new this();
      i.update = true;
      Object.keys(u).forEach(obj => { if(this.protected == null || this.protected.filter(x => x == obj).length == 0) {
        i[obj] = u[obj];
        i.oldData[obj] = u[obj];
      }});
      return i;
    })[0];
  }

  static where(p) {
    var whereString = " ";
    for(var i = 0; i < p.length; i++) whereString = whereString.concat((i > 0 ? " AND " : "WHERE ") + p[i][0] + ' ' + (p[i][2] != null ? p[i][1] : '=') + ' ' + SQLEscape(p[i][2] != null ? p[i][2] : p[i][1]));

    return DB.Query("SELECT * FROM " + this.table + whereString).map(u => {
      var i = new this();
      i.update = true;
      Object.keys(u).forEach(obj => { if(this.protected == null || this.protected.filter(x => x == obj).length == 0) {
        i[obj] = u[obj];
        i.oldData[obj] = u[obj];
      }});
      return i;
    });
  }

  belongsTo(model, source = (new Error()).stack.split("\n")[2].split(" ")[6].toLowerCase() + "_id", column = "id") {
    if(this[source] == null) throw new Error("Value can't be null!");
    return model.find(this[source], column);
  }

  hasMany(model, source = "id", column = (new Error()).stack.split("\n")[2].split(" ")[6].toLowerCase() + "_id") {
    if(this[source] == null) throw new Error("Value can't be null!");
    return model.where([
      [column, this[source]
    ]]);
  }

  static whereValue(values) {
    return this.where([
      ...values.map(x => [x[0], this[x[1]] == null ? x[1] : this[x[1]]])
    ]);
  }

  save() {
    let columns = DB.Query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ${SQLEscape(DB.database)} AND TABLE_NAME = ${SQLEscape(this.constructor.table)} AND DATA_TYPE != ${SQLEscape("timestamp")}`).map(x => x.COLUMN_NAME);

    if(this.update) {
      let val = "";
      let old = "";

      for(var i = 0; i < columns.length; i++) {
        if(this[columns[i]] == null) continue;
        val += columns[i] + "=" + SQLEscape(this[columns[i]]) + (i < columns.length - 1 ? ", " : "");
        old += columns[i] + " = " + SQLEscape(this.oldData[columns[i]]) + (i < columns.length - 1 ? " AND " : "");
        this.oldData[columns[i]] = this[columns[i]];
      }

      DB.Query(`UPDATE ${this.constructor.table} SET ${val} WHERE ${old}`);
    } else {
      let c = "";
      let v = "";

      for(var i = 0; i < columns.length; i++) {
        if(this[columns[i]] == null) continue;
        c += columns[i] + (i < columns.length - 1 ? ", " : "");
        v += SQLEscape(this[columns[i]]) + (i < columns.length - 1 ? ", " : "");
        this.oldData[columns[i]] = this[columns[i]];
      }

      DB.Query(`INSERT INTO ${this.constructor.table}(${c}) VALUES(${v})`);
    }
  }

  delete() {
    let columns = DB.Query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ${SQLEscape(DB.database)} AND TABLE_NAME = ${SQLEscape(this.constructor.table)} AND DATA_TYPE != ${SQLEscape("timestamp")}`).map(x => x.COLUMN_NAME);

    let conditions = "";

    for(var i = 0; i < columns.length; i++) {
      if(this[columns[i]] == null) continue;
      conditions += columns[i] + " = " + SQLEscape(this.oldData[columns[i]]) + (i < columns.length - 1 ? " AND " : "");
    }

    this.update = false;

    DB.Query(`DELETE FROM ${this.constructor.table} WHERE ${conditions}`);
  }
}

Model.table = null;

module.exports = Model;
