const SQLEscape = require('sqlstring').escape;

module.exports = (query) => {
    let wh = "";

    if(query.conditions)
        wh = " WHERE " + query.conditions.map(x => x.column + ' ' + x.condition + ' ' + SQLEscape(x.value)).join(" AND ");

    return `SELECT ${query.selector} FROM ${query.table}` + wh;
};