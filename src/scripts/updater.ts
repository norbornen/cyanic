#!/usr/bin/env node
import createConnection, { disconnect } from '../mongooseConnect';
import { ImportUsecase } from '../usecases/ImportUsecase';

enum ExtCode {'OK', 'FAIL'}

(async () => {
    let extcode: ExtCode = ExtCode.OK;
    let connection;
    try {
        connection = await createConnection({db: 'mongodb://localhost/cyanic'});

        console.info('[updater] ', new Date().toString());
        const usecase = new ImportUsecase();
        await usecase.getAndUpdateExtEntities();
    } catch (err) {
        console.error(err);
        extcode = ExtCode.FAIL;
    }

    if (connection) {
        await disconnect();
    }
    process.exit(extcode);
})();
