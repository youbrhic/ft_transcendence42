FROM nginx:alpine

# RUN apt update && apt upgrade -y && apt install -y nginx openssl

RUN apk add --no-cache openssl

RUN mkdir -p /etc/nginx/ssl

RUN openssl req -x509 -newkey rsa:4096 -keyout /etc/nginx/ssl/server.key -out /etc/nginx/ssl/server.crt \
    -days 365 -nodes -subj "/C=MO/ST=KH/L=KH/O=42/OU=42/CN=e3r11p8.1337.ma"

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

EXPOSE 443