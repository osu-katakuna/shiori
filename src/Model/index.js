const DB = require("../Database").GetSubsystem();
const QueryBuilder = require("./QueryBuilder");
const Logger = require("../Logger");

function ConstructModel(e, model) {
  if(e == null) return null;

  let m = new model();

  m.constructor.isNew = false;
  m.constructor.rows = Object.keys(e);

  let protected = [];
  if(model.protected != null) protected = model.protected; // do this to prevent lots of calls

  Object.keys(e).forEach(key => {
    let finalKey = key;

    if((o = Object.getOwnPropertyDescriptor(m, key)) != null && o.get != null) {
      Logger.Warning(`The main Model ${model.constructor.name} has already a getter called ${key}!`);
      Logger.Warning(`${key} will be replaced with _${key}!`);
      finalKey = '_' + key;
    }

    if(protected.filter(col => col == key).length >= 1)
      return;

    if(typeof e[key] == 'string' && e[key].indexOf("T") >= 10 && e[key][e[key].length - 1] == 'Z') {
      Logger.Warning(`${key} is a date!`);
      e[key] = new Date(e[key]);
    }

    m[finalKey] = e[key];
  });
  
  return m;
}

function GetIDField(model) {
  if(model.id != null) return "id";

  let q = Object.keys(model);

  for(let i = 0; i < q.length; i++)
    if(q[i].toLowerCase().indexOf("id") >= 0)
      return q[i];

  return null;
}

class Model {
  static all() {
    return DB.ExecuteQuery(new QueryBuilder(this.table).Select()).map(e => ConstructModel(e, this));
  }

  static find(id, column = "id") {
    return ConstructModel(DB.ExecuteQuery(new QueryBuilder(this.table).Select().Where(column, id))[0], this);
  }

  static where() {
    return DB.ExecuteQuery(new QueryBuilder(this.table).Select().Where(...arguments)).map(e => ConstructModel(e, this));
  }

  static whereOr() {
    return DB.ExecuteQuery(new QueryBuilder(this.table).Select().WhereOr(...arguments)).map(e => ConstructModel(e, this));
  }

  belongsTo(model, source = (new Error()).stack.split("\n")[2].split(" ")[6].toLowerCase() + "_id", column = "id") {
    if(this[source] == null) throw new Error("Value can't be null!");
    return model.find(this[source], column);
  }

  hasMany(model, source = "id", column = (new Error()).stack.split("\n")[2].split(" ")[6].toLowerCase() + "_id") {
    if(this[source] == null) throw new Error("Value can't be null!");
    return model.where(column, this[source]);
  }

  delete() {
    let field = GetIDField(this);

    if(this[field] == null) {
      throw new Error("No ID Field found!");
    };

    DB.ExecuteQuery(new QueryBuilder(this.constructor.table).Delete().Where(field, this[field]));
  }

  save(ignore = false) {
    let _c = GetIDField(this);
    let doInsert = this.constructor.isNew;
    let query = new QueryBuilder(this.constructor.table);
    query.ForceInsert = ignore;

    let r = Object.keys(this);
    if(this.constructor.rows != null) r = r.filter(a => this.constructor.rows.filter(b => a == b).length >= 1);

    (doInsert ? query.Insert : query.Update).bind(query)([...r.map(x => [x, this[x]])]);
    if(!doInsert) query.Where("id", this.id);

    DB.ExecuteQuery(query);

    if(doInsert) this.id = DB.ExecuteQuery(new QueryBuilder(null).SelectLastInsertedID()).id;
  }
}

Model.table = null;
Model.isNew = true;

module.exports = Model;
