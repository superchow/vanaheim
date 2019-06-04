import { AddComicFormInfo, GetComicRequestQuery } from 'vanaheim-shared/src/model/comic';
import { Service } from 'egg';

export default class ComicService extends Service {
  async add(comic: Partial<AddComicFormInfo>, cover: string) {
    return this.ctx.model.Comic.create({
      ...comic,
      cover: cover,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    });
  }

  async list(_query: GetComicRequestQuery) {
    return this.ctx.model.Comic.find({}, 'title titleOriginal read');
  }

  async findById(id: string) {
    return this.ctx.model.Comic.findOne({
      _id: id,
    });
  }
}
