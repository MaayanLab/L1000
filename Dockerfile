FROM node

ENV SOURCE_DIR /usr/src
RUN mkdir -p $SOURCE_DIR && cd $SOURCE_DIR
WORKDIR $SOURCE_DIR

ENV NODE_ENV production

COPY package.json $SOURCE_DIR/

RUN npm install --production

COPY dist $SOURCE_DIR/dist

EXPOSE 3000

CMD ["node", "dist/server"]
