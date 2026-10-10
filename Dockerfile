# DIT Containerized Web Service
FROM nginx:alpine

# Copiar archivos estáticos al directorio público de nginx
COPY . /usr/share/nginx/html/

# Exponer el puerto 80 del contenedor
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
