import { BadRequestError, NotFoundRequestError } from './../common/error';
import { Bookshelf, BookshelfDetail, ComicListNode } from 'vanaheim-shared';
import { Service } from 'egg';

export default class BookShelfService extends Service {
  async add(bookShelfTitle: string): Promise<Bookshelf> {
    if (!bookShelfTitle) {
      throw new BadRequestError('请输入书架标题');
    }
    const bookshelfList = await this.ctx.model.Bookshelf.find({});
    if (bookshelfList.some(o => bookShelfTitle === o.title)) {
      throw new BadRequestError('书架标题不能重复');
    }
    const { id, createdAt, modifiedAt, title, comicList } = await this.ctx.model.Bookshelf.create({
      title: bookShelfTitle,
      comicList: [],
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    });
    return {
      id,
      createdAt,
      modifiedAt,
      title,
      comicList,
    };
  }

  async list(): Promise<Bookshelf[]> {
    const response = await this.ctx.model.Bookshelf.find();
    return response.map(({ title, createdAt, modifiedAt, id, comicList }) => ({
      id,
      createdAt,
      modifiedAt,
      title,
      comicList,
    }));
  }

  async deleteById(bookShelfId: string) {
    const bookshelf = await this.ctx.model.Bookshelf.findById(bookShelfId);
    if (!bookshelf) {
      throw new NotFoundRequestError('书架已经被删除');
    }
    await this.ctx.model.Bookshelf.findByIdAndDelete(bookShelfId);
  }

  async getDetail(bookShelfId: string): Promise<BookshelfDetail> {
    const bookshelf = await this.ctx.model.Bookshelf.findById(bookShelfId);
    if (!bookshelf) {
      throw new NotFoundRequestError('书架不存在');
    }
    const { title, createdAt, modifiedAt, id, comicList } = bookshelf;

    const comicDetail = (await Promise.all(
      comicList.map(async id => {
        const comic = await this.ctx.model.Comic.findOne({ _id: id }, 'title titleOriginal read');
        if (!comic) {
          return;
        }
        const { title, titleOriginal } = comic;
        return { title, titleOriginal, id };
      })
    )).filter((o): o is ComicListNode => !!o);

    return { title, createdAt, modifiedAt, id, comicList: comicDetail };
  }

  public async addComic(bookShelfId: string, comicId: string) {
    const bookshelf = await this.ctx.model.Bookshelf.findById(bookShelfId);
    if (!bookshelf) {
      throw new NotFoundRequestError('添加漫画失败 书架不存在');
    }
    const comic = await this.ctx.model.Comic.findById(comicId);
    if (!comic) {
      throw new NotFoundRequestError('添加漫画失败 漫画不存在');
    }
    await this.ctx.model.Bookshelf.findOneAndUpdate(
      {
        _id: bookShelfId,
        comicList: { $ne: comicId },
      },
      {
        $push: { comicList: comicId },
      }
    );
  }

  public async removeComic(bookShelfId: string, comicId: string) {
    const bookshelf = await this.ctx.model.Bookshelf.findById(bookShelfId);
    if (!bookshelf) {
      throw new NotFoundRequestError('删除漫画失败 书架不存在');
    }
    await this.ctx.model.Bookshelf.findOneAndUpdate(
      {
        _id: bookShelfId,
      },
      {
        $pull: { comicList: comicId },
      }
    );
  }
}
