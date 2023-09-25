FROM nginx:stable
COPY ./dist/ /var/www
EXPOSE 80 443
