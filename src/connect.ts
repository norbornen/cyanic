import mongoose, { Mongoose, ConnectionOptions } from 'mongoose';

mongoose.set('debug', process.env.NODE_ENV === 'development');
const connectionOptions: ConnectionOptions =  {
    useNewUrlParser: true,
    autoCreate: true,
    useCreateIndex: true,
    useFindAndModify: false,
};

let Connection: Mongoose;

interface IMongoDBConnectOptions {
    db: string;
}

async function connect({ db }: IMongoDBConnectOptions): Promise<Mongoose> {
    try {
        return (Connection = await mongoose.connect(db, connectionOptions));
    } catch (err) {
        console.error('Error connecting to database: ', err);
        throw err;
    }
}

async function disconnect() {
    if (Connection) {
        try {
            return Connection.disconnect();
        } catch (err) {
            console.error(err);
        }
    }
}

export default async (o: IMongoDBConnectOptions) => {
    if (!Connection) {
        await connect(o);
        mongoose.connection.on('error', console.error.bind(console, 'connection error: '));
        mongoose.connection.on('disconnected', () => connect(o));
    }
    return Connection;
};

export { connect, disconnect };
