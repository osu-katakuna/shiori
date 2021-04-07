const SQLEscape = require('sqlstring').escape;

module.exports = (query) => {
    let wh = "";

    if(query.conditions)
        wh = " WHERE " + query.conditions.map(x => x.column + ' ' + x.condition + ' ' + SQLEscape(x.value)).join(" AND ");

    return `UPDATE ${query.table} SET ${query.values.map(x => x.column + ' = ' + SQLEscape(x.value)).join(', ')}${wh}`;
};