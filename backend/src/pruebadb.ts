const mongoose = require('mongoose');

// URI de conexión a MongoDB
const uri = 'mongodb://root:Quartup!01@mongodbhost:27017/almacen';

// Función para conectarse a MongoDB
async function connectToDatabase() {
  try {
    // Conecta a MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Tiempo de espera para la selección de servidor (5 segundos)
    });
    console.log('Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  } finally {
    // Cierra la conexión una vez se haya verificado
    await mongoose.disconnect();
  }
}