import createConnection, { disconnect } from '../mongooseConnect';
import { ImportUsecase } from '../usecases/ImportUsecase';

createConnection({db: 'mongodb://localhost/cyanic'})
.then(async () => {
    console.info('[notifier] ', new Date().toString());

    // const usecase = new ImportUsecase();
    // await usecase.getAndUpdateExtOffers();

    await disconnect();
    process.exit(0);
})
.catch(async (err) => {
    console.error(err);
    await disconnect();
    process.exit(1);
});
