#!/bin/bash

# Crear una Autoridad Certificadora (CA) propia
openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout RootCA.key -out RootCA.pem -subj "/C=US/CN=Example-Root-CA"

# Crear un archivo de configuración para el certificado
cat > domains.ext << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
EOF

# Generar una clave privada y una solicitud de firma de certificado (CSR)
openssl req -new -nodes -newkey rsa:2048 -keyout localhost.key -out localhost.csr -subj "/C=US/ST=YourState/L=YourCity/O=Example-Certificates/CN=localhost"

# Crear el certificado final
openssl x509 -req -sha256 -days 1024 -in localhost.csr -CA RootCA.pem -CAkey RootCA.key -CAcreateserial -extfile domains.ext -out localhost.crt

# Crear el archivo fullchain combinando el certificado del servidor y el certificado raíz
cat localhost.crt RootCA.pem > localhost-fullchain.pem

echo "Certificados creados con éxito."
echo "  - Clave privada: localhost.key"
echo "  - Certificado: localhost.crt"
echo "  - Cadena completa: localhost-fullchain.pem"
