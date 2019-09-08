import { Dictionary } from 'ramda';
import * as ejs from 'ejs';
import Telegraf, { ContextMessageUpdate } from 'telegraf';
import { ExtraEditMessage } from 'telegraf/typings/telegram-types';
import pRetry from 'p-retry';
import AbstractNotifcationProvider, { CtorArgs } from './abstract';



class TelegramNotifcationProvider extends AbstractNotifcationProvider {
    private _bot: Telegraf<ContextMessageUpdate>;
    private compiled: ejs.AsyncTemplateFunction;
    private readonly sendMessageExtraParameters: ExtraEditMessage = { parse_mode: 'HTML', disable_web_page_preview: true };

    constructor(...args: CtorArgs) {
        super(...args);
        this.compiled = ejs.compile(this.template!.html, { async: true });
    }

    private get bot(): Telegraf<ContextMessageUpdate> {
        if (!this._bot) {
            this._bot = new Telegraf(this.connection.token);
        }
        return this._bot;
    }

    public async send(msg_data: ejs.Data): Promise<boolean> {
        const message = await this.compiled({ data: msg_data });
        try {
            console.log('...');
            const o = await this.bot.telegram.sendMessage(this.connection.chatId, message, this.sendMessageExtraParameters);
            console.log('send', o);
        } catch (err) {
            console.log(err);
        }
        return true;

//         return pRetry(() => sendHtmlMessage(t),
//                     {retries: 10, onFailedAttempt: (err) => console.warn(`idx: ${idx}, err: ${err.toString()}`)})
//                     .catch((err) => {
//                         console.log(err);
//                         console.log(t);
//                     });

        return false;
    }
}

export default TelegramNotifcationProvider;
export { TelegramNotifcationProvider };

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
