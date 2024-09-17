#!/bin/bash

# Directorio que contiene los archivos JSON
JSON_DIR="solplay_json"

# Nombre de la base de datos de destino
DB_NAME="solplay_almacen"

# Conexión a MongoDB (ajusta según tu configuración, por ejemplo, si necesitas autenticación o un puerto diferente)
MONGO_URI="mongodb://localhost:27017"

# Iterar sobre cada archivo JSON en el directorio
for json_file in "$JSON_DIR"/*.json; do
    if [ -e "$json_file" ]; then
        # Extraer el nombre de la colección (sin la extensión .json)
        collection_name=$(basename "$json_file" .json)

        echo "Importando $json_file en la colección $collection_name de la base de datos $DB_NAME..."

        # Importar el archivo JSON a MongoDB
        mongoimport --uri="$MONGO_URI" --db="$DB_NAME" --collection="$collection_name" --file="$json_file" --jsonArray

        echo "Importación de $json_file completada."
    else
        echo "No se encontraron archivos JSON en $JSON_DIR"
    fi
done

