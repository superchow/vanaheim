import { Application } from 'egg';

export default (app: Application) => {
  const { router, controller } = app;
  router.post('/api/v1/workspace', controller.workspace.add);
  router.get('/api/v1/workspace', controller.workspace.list);
};
