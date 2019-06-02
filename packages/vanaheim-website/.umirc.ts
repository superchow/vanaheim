import { IConfig } from 'umi-types';
import { join } from 'path';

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  sass: {},
  alias: {
    common: join(__dirname, './src/common'),
  },
  proxy: {
    '/server/api/': {
      target: 'http://127.0.0.1:7001',
      changeOrigin: true,
      pathRewrite: { '^/server/api/': '/api/' },
    },
    '/server-static/': {
      target: 'http://127.0.0.1:7001',
      changeOrigin: true,
      pathRewrite: { '^/server-static/': '/static/' },
    },
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: { webpackChunkName: true },
        title: 'vanaheim-website',
        dll: true,
        locale: {
          enable: true,
          default: 'en-US',
        },
        pwa: {},
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
};

export default config;
