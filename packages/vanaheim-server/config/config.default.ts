import { EggAppConfig, PowerPartial } from 'egg';

export default function() {
  const config = {
    keys: '123',
    mongoose: {
      url: 'mongodb://127.0.0.1/admin',
      options: {},
    },
    security: {
      domainWhiteList: ['http://localhost:4200'],
    },
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    },
  };
  return config as PowerPartial<EggAppConfig>;
}
