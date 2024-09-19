// Nombre de la base de datos que quieres exportar
const dbName = 'solplay_almacen';

// Directorio donde se guardarán los archivos exportados
const exportDir = '/Users/quartup/work/dev/solplay/solplay-almacen-api/_docs/MONGO';
// Conectar a la base de datos
db = db.getSiblingDB(dbName);

// Conectar a la base de datos
db = db.getSiblingDB(dbName);

// Obtener todas las colecciones de la base de datos
const collections = db.getCollectionNames();

// Generar comandos de exportación para cada colección
collections.forEach(collectionName => {
    const filePath = `${exportDir}/${collectionName}.json`;
    const command = `mongoexport --db=${dbName} --collection=${collectionName} --out=${filePath} --jsonArray`;
    print(command);
});

print("\nCopia estos comandos y ejecútalos en tu terminal del sistema para exportar las colecciones.");