const axios = require('axios');
const Embed = require("./EmbedMessage");

class WebhookMessage {
    constructor(url) {
        this.url = url;
        this.content = null;
        this.username = null;
        this.avatar = null;
        this.embeds = [];

        this.tts = false;
        this.webClient = axios.create({
            validateStatus: false
        });
    }

    createEmbed() {
        this.embeds.push(new Embed());
        
        return this.embeds[this.embeds.length - 1];
    }

    send() {
        const o = {};

        this.content != null && (o.content = this.content);
        this.username != null && (o.username = this.username);
        this.avatar != null && (o.avatar_url = this.avatar);
        o.tts = this.tts;
        o.embeds = this.embeds.map(e => e.toObj());

        this.webClient.post(this.url, o);
    }
}

module.exports = WebhookMessage;