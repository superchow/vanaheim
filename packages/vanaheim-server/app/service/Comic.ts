import { AddComicFormInfo, GetComicRequestQuery } from 'vanaheim-shared';
import { Service } from 'egg';
import { fs } from 'mz';
import { join } from 'path';
import * as mongoose from 'mongoose';
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
    const comic = await this.ctx.model.Comic.findOneAndDelete({
      _id: id,
    });
    if (comic) {
      const workspaceId = comic.workspaceId;
      const workspace = await this.ctx.model.Workspace.findById({
        _id: workspaceId,
      });
      if (workspace && (await fs.exists(workspace.path))) {
        const deleted = join(workspace.path, 'deleted');
        if (!(await fs.exists(deleted))) {
          await fs.mkdir(deleted);
        }
        let id = mongoose.Types.ObjectId(comic._id).toString();
        const projectPath = join(workspace.path, id);
        if (await fs.exists(projectPath)) {
          await fs.rename(projectPath, join(deleted, id));
        }
      }
    }
    return comic;
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
