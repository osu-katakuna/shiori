let QueryType = require("./QueryType");
let QueryOperand = require("./QueryOperand");

class QueryBuilder {
    constructor(mainTable) {
        this.table = mainTable;
    }

    Select(col = "*") {
        this.query_type = QueryType.QUERY_SELECT;
        this.selector = col;
        return this;
    }

    Update(values) {
        if(!values instanceof Array && values.length == 0) return this;

        this.query_type = QueryType.QUERY_UPDATE;
        this.values = [];

        values.forEach(x => {
            this.values.push({
                column: x[0],
                value: x[1]
            });
        });

        return this;
    }

    SelectLastInsertedID() {
        this.query_type = QueryType.QUERY_LASTID;
        return this;
    }

    Delete() {
        this.query_type = QueryType.QUERY_DELETE;
        return this;
    }

    Insert(values) {
        if(!values instanceof Array && values.length == 0) return this;

        this.query_type = QueryType.QUERY_INSERT;
        this.values = [];

        values.forEach(x => {
            this.values.push({
                column: x[0],
                value: x[1]
            });
        });

        return this;
    }

    Where(column, value = null, value2 = null) {
        if(column instanceof Array && value == null && value2 == null) {
            column.forEach(x => this.Where(...x));
            return this;
        }

        let _value = "NULL";
        let condition = "=";

        if(value2 == null && value != null) {
            _value = value;
        } else {
            _value = value2;
            condition = value;
        }

        if(this.conditions == undefined) this.conditions = [];

        this.conditions.push({
            type: QueryOperand.AND,
            value: _value,
            condition,
            column
        });

        return this;
    }

    WhereOr(column, value = null, value2 = null) {
        if(column instanceof Array && value == null && value2 == null) {
            column.forEach(x => this.WhereOr(...x));
            return this;
        }

        let _value = "NULL";
        let condition = "=";

        if(value2 == null && value != null) {
            _value = value;
        } else {
            _value = value2;
            condition = value;
        }

        if(this.conditions == undefined) this.conditions = [];

        this.conditions.push({
            type: QueryOperand.OR,
            value: _value,
            condition,
            column
        });

        return this;
    }
}

module.exports = QueryBuilder;