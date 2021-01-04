class EmbedMessage {
    constructor() {
        this.title = null;
        this.description = null;
        this.color = null;

        this.footer = {
            text: null,
            icon_url: null
        };

        this.image = {
            url: null,
            width: null,
            height: null
        };

        this.author = {
            name: null,
            url: null,
            icon_url: null
        };

        this.fields = [];
    }

    addField() {
        this.fields.push({
            name: null,
            value: null,
            inline: false
        });

        return this.fields[this.fields.length - 1];
    }

    toObj() {
        let e = this;

        for (var propName in e) { 
            if (e[propName] === null || e[propName] === undefined) {
                delete e[propName];
            }
        }

        return e;
    }
}

module.exports = EmbedMessage;