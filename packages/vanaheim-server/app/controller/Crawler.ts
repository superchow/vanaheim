import { Controller } from 'egg';
import { SearchComicRawInfoRequest } from 'vanaheim-shared/src';

export default class ComicController extends Controller {
  async test() {
    const { ctx } = this;
    const query: SearchComicRawInfoRequest = ctx.query;

    ctx.body = {
      data: await this.service.crawler.search(query.type, query.keyword),
    };
  }
}
