import mongoose, { Mongoose } from 'mongoose';

interface IMongoDBConnectOptions {
    db: string;
}

let Connection: Mongoose;

async function connect({ db }: IMongoDBConnectOptions): Promise<Mongoose> {
    try {
        return (Connection = await mongoose.connect(db, { useNewUrlParser: true, autoCreate: true }));
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
