import createConnection, { disconnect } from '../src/mongooseConnect';
import { ExtSourceModel } from '../src/models/ExtSource';

enum ExtCode {'OK', 'FAIL'}

(async () => {
    let extcode: ExtCode = ExtCode.OK;
    try {
        await createConnection({db: 'mongodb://localhost/cyanic'});
        await script_body();
    } catch (err) {
        console.error(err);
        extcode = ExtCode.FAIL;
    }
    await disconnect();
    process.exit(extcode);
})();

async function script_body() {
    await ExtSourceModel.updateMany({}, { frequency: '*/20 * * * *' });
}
