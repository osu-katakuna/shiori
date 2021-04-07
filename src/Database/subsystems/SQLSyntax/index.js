let QueryType = require("../../../Model/QueryType");

let SyntaxHandler = {
    [QueryType.QUERY_SELECT]: require("./Select"),
    [QueryType.QUERY_UPDATE]: require("./Update"),
    [QueryType.QUERY_INSERT]: require("./Insert"),
    [QueryType.QUERY_DELETE]: require("./Delete"),
    [QueryType.QUERY_LASTID]: require("./LastID")
}

function ReturnSyntax(query) {
    if(query != null && query.query_type != null && (x = SyntaxHandler[query.query_type]) != null) return x(query);
    return "";
}

module.exports = (q) => {
    let x = ReturnSyntax(q);
    console.log("Debug SQL Syntax:", x);
    return x;
};