FROM node:8-slim

WORKDIR /server

COPY . /server
RUN npm set unsafe-perm true
RUN npm install

EXPOSE 9999
CMD [ "npm", "start" ]
