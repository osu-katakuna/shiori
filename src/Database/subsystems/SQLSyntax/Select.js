const SQLEscape = require('sqlstring').escape;
const QueryOperand = require('../../../Model/QueryOperand')

module.exports = (query) => {
    let wh = "";

    if(query.conditions) {
        wh = " WHERE ";
        for(let i = 0; i < query.conditions.length; i++) {
            let x = query.conditions[i];
            wh += x.column + ' ' + x.condition + ' ' + SQLEscape(x.value);
            if(i < query.conditions.length - 1) {
                if(x.type == QueryOperand.AND) wh += " AND ";
                else if(x.type == QueryOperand.OR) wh += " OR ";
                else wh += " AND "; // fallback to AND
            }
        }
    }

    return `SELECT ${query.selector} FROM ${query.table}` + wh;
};