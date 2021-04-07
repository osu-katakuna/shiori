const SQLEscape = require('sqlstring').escape;

module.exports = (query) => {
    return `INSERT${query.ForceInsert != null && query.ForceInsert ? " IGNORE ": " "}INTO ${query.table} (${query.values.map(x => x.column).join(', ')}) VALUES (${query.values.map(x => SQLEscape(x.value)).join(', ')})`;
};