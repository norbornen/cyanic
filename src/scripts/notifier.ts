#!/usr/bin/env node
import createConnection, { disconnect } from '../mongooseConnect';
import { NotificationUsecase } from '../usecases/NotificationUsecase';

enum ExtCode {'OK', 'FAIL'}

(async () => {
    console.info('[notifier::start] ', new Date().toString());
    let extcode: ExtCode = ExtCode.OK;
    let connection;
    try {
        connection = await createConnection({db: 'mongodb://localhost/cyanic'});

        const usecase = new NotificationUsecase();
        await usecase.sendNotifications();
    } catch (err) {
        console.error(err);
        extcode = ExtCode.FAIL;
    }

    if (connection) {
        await disconnect();
    }
    console.info('[notifier::done] ', new Date().toString(), '\n');
    process.exit(extcode);
})();
