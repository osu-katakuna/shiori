const SQLEscape = require('sqlstring').escape;

module.exports = (query) => {
    if(!query.conditions) throw new Error("No conditions!");

    return `DELETE FROM ${query.table} WHERE ` + query.conditions.map(x => x.column + ' ' + x.condition + ' ' + SQLEscape(x.value)).join(" AND ");
};