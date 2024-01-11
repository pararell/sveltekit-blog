FROM node:20.10.0-alpine AS buildContainer

WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app/code
COPY ./ /usr/src/app/code

RUN cd code \
  && npm i \
  && npm run build \
  && mv build server package.json ../ \
  && cd ../ \
  && rm -rf code

RUN cd server \
    && npm i 

CMD ["/bin/sh" , "-c" , "cd ./server && npm run start"]
