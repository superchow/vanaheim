import { Application } from 'egg';

export default (app: Application) => {
  const { router, controller } = app;

  router.get('/add', controller.user.add);
  router.get('/get', controller.user.get);
  router.get('/api/v1/folders', controller.file.listFile);
};
