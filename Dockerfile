FROM node:chakracore-10.13.0
LABEL name="startpage"
LABEL maintainer="Kevin Zuern <kevin@zuern.ca>"
RUN mkdir -p /var/www/startpage
COPY . /var/www/startpage
RUN cd /var/www/startpage && npm install
EXPOSE 3000
CMD ["node", "/var/www/startpage/bin/www"]
