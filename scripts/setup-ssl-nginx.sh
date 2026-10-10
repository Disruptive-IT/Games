#!/usr/bin/env bash
# ==============================================================================
# Script de Configuración Inicial de Nginx y Certificado SSL (Let's Encrypt)
# Dominio: play.neurodit.com
# Servidor: /home/Disruptive/Projects/Games
# ==============================================================================

set -e

DOMAIN="play.neurodit.com"
EMAIL="admin@neurodit.com"
PROJECT_DIR="/home/Disruptive/Projects/Games"
NGINX_CONF_SOURCE="${PROJECT_DIR}/nginx/play.neurodit.com.conf"
NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"

echo "=========================================================="
echo "🚀 Iniciando configuración de Nginx y SSL para ${DOMAIN}"
echo "=========================================================="

# 1. Comprobar permisos de superusuario (root o sudo)
if [ "$EUID" -ne 0 ]; then
  echo "❌ Por favor, ejecuta este script con privilegios sudo o root:"
  echo "   sudo bash $0"
  exit 1
fi

# 2. Verificar e instalar Nginx y Certbot si no están presentes
echo "📦 Verificando dependencias (Nginx, Certbot)..."
if ! command -v nginx &> /dev/null; then
  echo "Instalando Nginx..."
  apt update && apt install -y nginx || yum install -y nginx
fi

if ! command -v certbot &> /dev/null; then
  echo "Instalando Certbot y plugin de Nginx..."
  apt update && apt install -y certbot python3-certbot-nginx || yum install -y certbot python3-certbot-nginx
fi

# 3. Crear directorios necesarios
mkdir -p /var/www/certbot
mkdir -p "${NGINX_AVAILABLE}"
mkdir -p "${NGINX_ENABLED}"

# 4. Configurar bloque temporal HTTP para emitir certificado
echo "🔧 Preparando configuración HTTP temporal para validación Let's Encrypt..."
TEMP_CONF="/etc/nginx/conf.d/${DOMAIN}-temp.conf"

cat <<EOF > "${TEMP_CONF}"
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'Servidor listo para emisión SSL';
        add_header Content-Type text/plain;
    }
}
EOF

nginx -t
systemctl reload nginx || systemctl start nginx

# 5. Obtener certificado SSL mediante Certbot
echo "🔒 Obteniendo certificado SSL Let's Encrypt para ${DOMAIN}..."
if [ ! -d "/etc/letsencrypt/live/${DOMAIN}" ]; then
  certbot certonly --webroot -w /var/www/certbot \
    -d "${DOMAIN}" \
    --email "${EMAIL}" \
    --agree-tos \
    --no-eff-email \
    --non-interactive
  echo "✅ Certificado SSL generado con éxito en /etc/letsencrypt/live/${DOMAIN}/"
else
  echo "ℹ️ El certificado SSL ya existe en /etc/letsencrypt/live/${DOMAIN}/. Omitiendo emisión."
fi

# 6. Eliminar configuración temporal y enlazar la configuración definitiva
rm -f "${TEMP_CONF}"

echo "📋 Instalando configuración definitiva de Nginx..."
if [ -d "${NGINX_AVAILABLE}" ]; then
  cp "${NGINX_CONF_SOURCE}" "${NGINX_AVAILABLE}/${DOMAIN}.conf"
  ln -sf "${NGINX_AVAILABLE}/${DOMAIN}.conf" "${NGINX_ENABLED}/${DOMAIN}.conf"
else
  cp "${NGINX_CONF_SOURCE}" "/etc/nginx/conf.d/${DOMAIN}.conf"
fi

# 7. Probar y reiniciar Nginx
echo "🧪 Probando configuración de Nginx..."
nginx -t

echo "🔄 Reiniciando servicio Nginx..."
systemctl reload nginx || systemctl restart nginx

# 8. Comprobar renovación automática de certificados
systemctl enable --now certbot.timer 2>/dev/null || true

echo "=========================================================="
echo "🎉 ¡Configuración completada exitosamente!"
echo "Dominio: https://${DOMAIN}"
echo "Proxy:   http://127.0.0.1:3080 -> https://${DOMAIN}"
echo "=========================================================="
