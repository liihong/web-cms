FROM mhart/alpine-node:8.9.4

WORKDIR /cms-server
COPY package.json /cms-server/package.json
RUN npm i --production --registry=https://registry.npm.taobao.org

COPY src /cms-server/src
COPY view /cms-server/view
COPY www /cms-server/www
COPY production.js /cms-server/production.js

ENV DOCKER=true
EXPOSE 8360
CMD [ "node", "/cms-server/production.js" ]