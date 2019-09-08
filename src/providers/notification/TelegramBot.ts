import Telegraf, { ContextMessageUpdate } from 'telegraf';
import PQueue from 'p-queue';

class TelegramBot {
    private _bot: Telegraf<ContextMessageUpdate>;

    // protected get agent(): AxiosInstance {
    //     if (!this._agent) {
    //         this._agent = createHttpAgent(this.baseURL);
    //     }
    //     return this._agent;
    // }
}

export default TelegramBot;
export { TelegramBot };

// const pRetry = require('p-retry');
// const { sendHtmlMessage } = require('./lib/bot');
// const queue = new PQueue({concurrency: 1});
// async function run() {
//     offers.forEach((x, idx) => queue.add(() => {
//         const t = x.toHtml().replace(/(Россия|Москва),\s*/g, '');
//         return pRetry(() => sendHtmlMessage(t),
//                     {retries: 10, onFailedAttempt: (err) => console.warn(`idx: ${idx}, err: ${err.toString()}`)})
//                     .catch((err) => {
//                         console.log(err);
//                         console.log(t);
//                     });
//     }));
// }

// const config = require('config');
// const Telegraf = require('telegraf');

// const token = config.get('telegram.token');
// const chatId = config.get('telegram.chatId');
// const bot = new Telegraf(token);

// module.exports.sendMessage = async (message) => {
//     const parameters = {disable_web_page_preview: true};
//     return bot.telegram.sendMessage(chatId, message, parameters);
// };

// module.exports.sendHtmlMessage = async (message) => {
//     const parameters = {
//         parse_mode: 'html',
//         disable_web_page_preview: true
//     };
//     return bot.telegram.sendMessage(chatId, message, parameters);
// };
