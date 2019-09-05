const config = require('config');
const Telegraf = require('telegraf');

const token = config.get('telegram.token');
const chatId = config.get('telegram.chatId');
const bot = new Telegraf(token);

module.exports.sendMessage = async (message) => {
    const parameters = {disable_web_page_preview: true};
    return bot.telegram.sendMessage(chatId, message, parameters);
};

module.exports.sendHtmlMessage = async (message) => {
    const parameters = {
        parse_mode: 'html',
        disable_web_page_preview: true
    };
    return bot.telegram.sendMessage(chatId, message, parameters);
};
