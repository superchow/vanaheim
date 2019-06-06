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

  async countTags(type: string) {
    const response = await this.ctx.model.Comic.aggregate([
      { $project: { _id: 0, [type]: 1 } },
      { $unwind: `$${type}` },
      {
        $group: {
          _id: `$${type}`,
          count: { $sum: 1 },
        },
      },
    ]);
    return response.map(({ _id: id, count }) => ({ id, count }));
  }
}
