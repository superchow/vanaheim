import { extend } from 'umi-request';

export const request = extend({
  maxCache: 10,
  prefix: 'http://127.0.0.1:7001/api/',
});
