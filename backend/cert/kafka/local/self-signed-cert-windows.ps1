# Crear una Autoridad Certificadora (CA) propia
$rootCert = New-SelfSignedCertificate -DnsName "Example-Root-CA" -KeyUsage CertSign -KeyExportPolicy Exportable -CertStoreLocation "Cert:\CurrentUser\My"

# Crear un certificado para localhost firmado por nuestra CA
$cert = New-SelfSignedCertificate -DnsName "localhost" -KeyUsage DigitalSignature,KeyEncipherment -KeyExportPolicy Exportable -CertStoreLocation "Cert:\CurrentUser\My" -Signer $rootCert

# Exportar el certificado raíz
$rootCertPath = "RootCA.cer"
Export-Certificate -Cert $rootCert -FilePath $rootCertPath -Type CERT

# Exportar el certificado de localhost y su clave privada
$certPath = "localhost.pfx"
$certPassword = ConvertTo-SecureString -String "YourStrongPassword" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath $certPath -Password $certPassword

# Exportar el certificado público de localhost
$publicCertPath = "localhost.cer"
Export-Certificate -Cert $cert -FilePath $publicCertPath -Type CERT

# Combinar los certificados para crear fullchain
Get-Content $publicCertPath, $rootCertPath | Set-Content "localhost-fullchain.pem"

Write-Host "Certificados creados con éxito."
Write-Host "  - Certificado con clave privada: $certPath"
Write-Host "  - Certificado público: $publicCertPath"
Write-Host "  - Certificado raíz: $rootCertPath"
Write-Host "  - Cadena completa: localhost-fullchain.pem"
Write-Host ""
Write-Host "Nota: El archivo .pfx está protegido con la contraseña 'YourStrongPassword'. Cámbiala según sea necesario."
