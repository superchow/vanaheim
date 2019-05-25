import { Controller } from 'egg';

export default class ComicController extends Controller {
  public async listFile() {
    const { ctx } = this;
    ctx.body = {
      data: [...(await ctx.service.file.listFile(ctx.query.parent))],
    };
  }
}
