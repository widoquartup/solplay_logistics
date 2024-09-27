#!/bin/bash

# Directorio donde se encuentran los archivos BSON
BSON_DIR="solplay/solplay_almacen"

# Directorio donde se guardarán los archivos JSON
JSON_DIR="solplay_json"

# Crear el directorio JSON si no existe
mkdir -p "$JSON_DIR"


# Procesar cada archivo BSON en el directorio
for bson_file in "$BSON_DIR"/*.bson; do
    if [ -e "$bson_file" ]; then
        # Extraer el nombre de la colección (sin la extensión .bson)
        collection_name=$(basename "$bson_file" .bson)

        # Definir el archivo JSON de destino
        json_file="$JSON_DIR/$collection_name.json"

        echo "Convirtiendo $bson_file a $json_file..."

        # Crear el archivo JSON con un array vacío al principio
        echo "[" > "$json_file"

        # Convertir BSON a JSON y añadir cada documento al archivo
        bsondump "$bson_file" | sed '$!s/$/,/' >> "$json_file"

        # Añadir el cierre del array
        echo "]" >> "$json_file"

        echo "Conversión de $bson_file a $json_file completada."
    else
        echo "No se encontraron archivos BSON en $BSON_DIR"
    fi
done

