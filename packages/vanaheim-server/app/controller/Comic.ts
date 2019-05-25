import { Controller } from 'egg';

export default class ComicController extends Controller {
  public async add() {
    const { ctx } = this;
    await ctx.service.user.add();
    ctx.body = {
      message: 'success',
    };
  }

  public async get() {
    const { ctx } = this;
    ctx.body = {
      data: await ctx.service.user.get(),
    };
  }
}
