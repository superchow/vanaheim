import { Application } from 'egg';
const range = require('koa-range');

export default (app: Application) => {
  const { router, controller } = app;
  router.post('/api/v1/workspace', controller.workspace.add);
  router.get('/api/v1/workspace', controller.workspace.list);
  router.delete('/api/v1/workspace', controller.workspace.delete);
  router.get('/api/v1/workspace/file', controller.workspace.listFile);
  router.post('/api/v1/comic/add', controller.comic.add);
  router.post('/api/v1/comic', controller.comic.list);
  router.delete('/api/v1/comic/:id', controller.comic.delete);
  router.post('/api/v1/comic/tagsCount', controller.comic.tags);
  router.get('/api/v1/crawler', controller.crawler.test);
  router.get('/static/cover/:id', controller.comic.cover);
  router.get(
    '/static/comic/:id/:name',
    async function(ctx, next) {
      await next();
      ctx.set('Connection', 'close');
    },
    range,
    controller.comic.getZip
  );
};
