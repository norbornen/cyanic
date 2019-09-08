import { isNil, isEmpty } from 'ramda';
import * as ejs from 'ejs';
import Telegraf, { ContextMessageUpdate, TelegrafOptions } from 'telegraf';
import { ExtraEditMessage } from 'telegraf/typings/telegram-types';
import ProxyAgent from 'proxy-agent';
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
            const telegrafOptions: TelegrafOptions = {};
            if ('proxy' in this.connection && !isNil(this.connection.proxy) && !isEmpty(this.connection.proxy)) {
                const agent: any = new ProxyAgent(this.connection.proxy);
                telegrafOptions.telegram = { agent };
            }
            this._bot = new Telegraf(this.connection.token, telegrafOptions);
        }
        return this._bot;
    }

    public async send(msg_data: ejs.Data): Promise<boolean> {
        let ok: boolean = false;
        const message = await this.compiled({ data: msg_data });
        try {
            await this.bot.telegram.sendMessage(this.connection.chatId, message, this.sendMessageExtraParameters);
            ok = true;
        } catch (err) {
            console.error(err);
        }
        return ok;
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
