import { BadRequestError, NotFoundRequestError } from './../common/error';

module.exports = () => {
  return async function(ctx, next) {
    try {
      await next();
    } catch (err) {
      if (err instanceof BadRequestError) {
        ctx.status = 400;
        ctx.body = {
          message: err.message,
        };
        return;
      }
      if (err instanceof NotFoundRequestError) {
        ctx.status = 404;
        ctx.body = {
          message: err.message,
        };
        return;
      }
      throw err;
    }
  };
};
