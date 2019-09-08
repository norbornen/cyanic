import createConnection, { disconnect } from '../mongooseConnect';
import { NotificationUsecase } from '../usecases/NotificationUsecase';

createConnection({db: 'mongodb://localhost/cyanic'})
.then(async () => {
    console.info('[notifier] ', new Date().toString());
    const usecase = new NotificationUsecase();
    await usecase.sendNotifications();

    await disconnect();
    process.exit(0);
})
.catch(async (err) => {
    console.error(err);
    await disconnect();
    process.exit(1);
});
