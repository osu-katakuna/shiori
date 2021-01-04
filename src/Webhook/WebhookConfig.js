const webhookDefaultConfig = {
    alertWebhook: null
};

var ConfigManager = new (require('../ConfigManager'))("webhook", webhookDefaultConfig);

module.exports = ConfigManager;