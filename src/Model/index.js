const DB = require("../Database").GetSubsystem();
const SQLEscape = require('sqlstring').escape;

class Model {
  constructor() {

  }

  static all() {
    return DB.Query("SELECT * FROM " + this.table).map(u => {
      var i = new this();
      Object.keys(u).forEach(obj => i[obj] = u[obj]);
      return i;
    });
  }

  static find(id, column = "id") {
    return DB.Query("SELECT * FROM " + this.table + " WHERE " + column + " = ?", id).map(u => {
      var i = new this();
      Object.keys(u).forEach(obj => i[obj] = u[obj]);
      return i;
    })[0];
  }

  static where(p) {
    var whereString = " ";
    for(var i = 0; i < p.length; i++) whereString = whereString.concat((i > 0 ? " AND " : "WHERE ") + p[i][0] + ' ' + (p[i][2] != null ? p[i][1] : '=') + ' ' + SQLEscape(p[i][2] != null ? p[i][2] : p[i][1]));

    return DB.Query("SELECT * FROM " + this.table + whereString).map(u => {
      var i = new this();
      Object.keys(u).forEach(obj => i[obj] = u[obj]);
      return i;
    });
  }
}

Model.table = null;

module.exports = Model;
