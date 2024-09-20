import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectToMongoDB = async () => {
    if (!process.env.MONGO_CLUSTER) {
        console.log('Variable MONGO_CLUSTER no definida. MongoDB no será utilizado.');
        return;
    }

    // const username = encodeURIComponent(process.env.MONGO_USERNAME ?? '');
    // const password = encodeURIComponent(process.env.MONGO_PASSWORD ?? '');
    // const clusterUrl = process.env.MONGO_CLUSTER;
    // const authSource = "admin";
    const database = process.env.MONGO_DB ?? 'defaultDB';
    // let proto = 'mongodb';

    // if (process.env.MONGO_IS_SRV === 'yes') {
    //     proto = 'mongodb+srv';
    // }

    // const uri = `${proto}://${username}:${password}@${clusterUrl}/${database}?authSource=${authSource}`;
    const uri = process.env.DB_URI ?? '';
    try {
        await mongoose.connect(uri);
        // console.log('Conectado a DB:');
        console.log('Conectado a DB:', uri, database);
    } catch (err) {
        console.error('Error al conectar a MongoDB:', err);
    }
};
