#!/usr/bin/env node
import createConnection, { disconnect } from '../mongooseConnect';
import { NotificationUsecase } from '../usecases/NotificationUsecase';

enum ExtCode {'OK', 'FAIL'}

(async () => {
    let extcode: ExtCode = ExtCode.OK;
    let connection;
    try {
        connection = await createConnection({db: 'mongodb://localhost/cyanic'});

        console.info('[notifier] ', new Date().toString());
        const usecase = new NotificationUsecase();
        await usecase.sendNotifications();
    } catch (err) {
        console.error(err);
        extcode = ExtCode.FAIL;
    }

    if (connection) {
        await disconnect();
    }
    process.exit(extcode);
})();
