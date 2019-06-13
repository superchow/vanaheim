import { Controller } from 'egg';
import { DeleteComicRequest, AddComicRequest } from 'vanaheim-shared';

export default class BookShelfController extends Controller {
  public async add() {
    const { ctx } = this;
    const body = ctx.request.body;
    ctx.body = {
      data: await this.service.bookshelf.add(body.title),
    };
  }

  public async remove() {
    const { ctx } = this;
    const bookShelfId = ctx.params.id;
    await this.service.bookshelf.deleteById(bookShelfId);
    ctx.status = 204;
  }

  public async list() {
    const { ctx } = this;
    ctx.body = {
      data: await this.service.bookshelf.list(),
    };
  }

  public async addComic() {
    const { ctx } = this;
    const body: AddComicRequest = ctx.request.body;
    const bookShelfId = ctx.params.id;
    await this.service.bookshelf.addComic(bookShelfId, body.comicId);
    ctx.status = 204;
  }

  public async removeComic() {
    const { ctx } = this;
    const body: DeleteComicRequest = ctx.request.body;
    const bookShelfId = ctx.params.id;
    await this.service.bookshelf.removeComic(bookShelfId, body.comicId);
    ctx.status = 204;
  }
}
