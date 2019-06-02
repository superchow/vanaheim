import { extend } from 'umi-request';

export const request = extend({
  maxCache: 10,
  prefix: '/server/api/',
});
