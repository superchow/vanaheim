import { Application } from 'egg';

export default (app: Application) => {
  const { router, controller } = app;
  router.post('/api/v1/workspace', controller.workspace.add);
  router.get('/api/v1/workspace', controller.workspace.list);
  router.delete('/api/v1/workspace', controller.workspace.delete);
  router.get('/api/v1/workspace/file', controller.workspace.listFile);
  router.post('/api/v1/comic/add', controller.comic.add);
  router.get('/api/v1/comic', controller.comic.list);
  router.get('/static/cover/:id', controller.comic.cover);
};
