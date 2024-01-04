FROM node:18.16.0-alpine AS buildContainer

WORKDIR /usr/app
COPY ./ ./
RUN npm install
RUN cd server \
    && npm install \
      && cd ..
ADD start.sh /
RUN chmod +x /start.sh

CMD ["/start.sh"]
