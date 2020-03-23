FROM nginx:stable

COPY ./dist/rightfoot-payments-demo /var/www
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD ["sh", "-c", "nginx -g 'daemon off;'"]

EXPOSE 80
