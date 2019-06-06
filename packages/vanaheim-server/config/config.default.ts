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
    bodyParser: {
      jsonLimit: '500mb',
      formLimit: '600mb',
    },
    multipart: {
      mode: 'stream',
      autoFields: false,
      defaultCharset: 'utf8',
      fieldNameSize: 100,
      fields: 100,
      fieldSize: '100mb',
      fileSize: '1000mb',
      files: 1000,
    },
  };
  return config as PowerPartial<EggAppConfig>;
}
