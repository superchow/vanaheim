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

  async list(query: GetComicRequestQuery) {
    const { offset } = query;
    const comicQuery = this.ctx.model.Comic.find({}, 'title titleOriginal read');
    comicQuery.skip(offset);
    comicQuery.limit(24);
    ['tags', 'artist', 'parody', 'group', 'character', 'reclass', 'workspaceId'].forEach(key => {
      const data = query[key];
      if (Array.isArray(data) && data.length > 0) {
        comicQuery.find({
          [key]: {
            $in: data,
          },
        });
      }
    });
    return comicQuery.exec();
  }

  async findById(id: string) {
    return this.ctx.model.Comic.findOne({
      _id: id,
    });
  }

  async deleteById(id: string) {
    return this.ctx.model.Comic.deleteOne({
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
