import { EggAppConfig, PowerPartial } from 'egg';

export default function() {
  const config = {
    mongoose: {
      url: 'mongodb://127.0.0.1/admin',
      options: {},
    },
    security: {
      csrf: {
        enable: false,
      },
    },
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    },
  };
  return config as PowerPartial<EggAppConfig>;
}
