FROM node

COPY . /source/
WORKDIR /source

RUN yarn && yarn bootstrap

CMD yarn dev
