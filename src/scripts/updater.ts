#!/usr/bin/env node
// NODE_OPTIONS='--http-parser=legacy --insecure-http-parser' ./dist/scripts/updater.js
import createConnection, { disconnect } from '../mongooseConnect';
import { ImportUsecase } from '../usecases/ImportUsecase';

enum ExtCode {'OK', 'FAIL'}

(async () => {
    console.info('[updater::start] ', new Date().toString());
    let extcode: ExtCode = ExtCode.OK;
    let connection;
    try {
        connection = await createConnection({db: 'mongodb://localhost/cyanic'});

        const usecase = new ImportUsecase();
        await usecase.getAndUpdateExtEntities();
    } catch (err) {
        console.error(err);
        extcode = ExtCode.FAIL;
    }

    if (connection) {
        await disconnect();
    }
    console.info('[updater::done] ', new Date().toString(), '\n');
    process.exit(extcode);
})();
