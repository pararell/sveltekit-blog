FROM node:18.16.0-alpine AS buildContainer

WORKDIR /usr/app
COPY ./ ./
RUN npm install
RUN cd server \
    && npm install \
      && cd ..

CMD ["/bin/sh" , "-c" , "npm run build && cd ./server && npm run start"]
