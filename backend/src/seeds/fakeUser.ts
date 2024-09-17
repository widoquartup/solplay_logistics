import { UserModel } from "@src/app/Resources/Auth/User/UserModel";
// const { faker } = require('@faker-js/faker');
import { faker } from "@faker-js/faker";
import { connectToMongoDB } from '@base/mongoConnection'; // La conexión se inicia automáticamente
import mongoose from 'mongoose';
export const fakeUser = async () => {
    await connectToMongoDB();
    const UserModelsFalsos = [];
    for (let i = 0; i < 50; i++) {
        const UserModelFalso = new UserModel({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            metadata: { info: faker.lorem.sentence() },
            app: 'dev-app',
            isDeleted: false,
        });
        UserModelsFalsos.push(UserModelFalso);
    }


    try {
        await UserModel.insertMany(UserModelsFalsos);
    } catch (error) {
        console.error("Error al insertar usuarios falsos:", error);
    } finally {
        await mongoose.connection.close(); // Cierra la conexión a la base de datos
        console.info("Conexión a la base de datos cerrada.");
    }

};