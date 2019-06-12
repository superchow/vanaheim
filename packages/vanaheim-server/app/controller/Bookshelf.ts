import { Controller } from 'egg';
import { DeleteComicRequest, AddComicRequest } from 'vanaheim-shared';

export default class BookShelfController extends Controller {
  public async add() {
    const { ctx } = this;
    const body = ctx.request.body;
    try {
      await this.service.bookshelf.add(body.title);
      ctx.status = 201;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        message: error.message,
      };
    }
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
    try {
      await this.service.bookshelf.addComic(bookShelfId, body.comicId);
      ctx.status = 204;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        message: error.message,
      };
    }
  }

  public async removeComic() {
    const { ctx } = this;
    const body: DeleteComicRequest = ctx.request.body;
    const bookShelfId = ctx.params.id;
    try {
      await this.service.bookshelf.removeComic(bookShelfId, body.comicId);
      ctx.status = 204;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        message: error.message,
      };
    }
  }
}
