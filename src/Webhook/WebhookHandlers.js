const e = require("express");
let Config = require("./WebhookConfig");
const WebhookMessage = require("./WebhookMessage");

function onUserRestriction(r) {
    if(Config.alertWebhook === null) {
        return;
    }

    let user = r.User;

    let msg = new WebhookMessage(Config.alertWebhook);
    msg.username = "shiori!";

    let embed = msg.createEmbed();

    embed.title = "shiori! >> User Restriction";
    embed.description = "An shiori! user got restricted. lol!";
    embed.color = 13632027;

    embed.author.name = user.name;
    embed.author.url = "https://katakuna.tk/u/" + user.id;
    embed.author.icon_url = "https://a.katakuna.tk/" + user.id;

    let reason = embed.addField();
    reason.name = "Reason:";
    reason.value = r.reason;
    reason.inline = true;

    let time = embed.addField();
    time.name = "Expiration time:";
    time.value = r.permanent ? '**Permanently restricted**' : new Date(r.end).toUTCString();
    time.inline = true;

    msg.send();
}

module.exports = {
    onUserRestriction
};