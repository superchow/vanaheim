import { AddComicFormInfo, GetComicRequestQuery, TagTypeArray } from 'vanaheim-shared';
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
    const { offset = 0 } = query;
    const comicQuery = this.ctx.model.Comic.find({}, 'title titleOriginal read');
    comicQuery.skip(offset);
    TagTypeArray.forEach(key => {
      const data = query[key];
      if (Array.isArray(data) && data.length > 0) {
        comicQuery.find({
          [key]: {
            $all: data,
          },
        });
      }
    });
    return comicQuery.exec();
  }

  async getComicPath(id: string) {
    const comic = await this.ctx.model.Comic.findById({
      _id: id,
    });
    if (!comic) {
      throw new Error('漫画不存在');
    }
    const workspaceId = comic.workspaceId;
    const workspace = await this.ctx.model.Workspace.findById({
      _id: workspaceId,
    });
    if (!workspace) {
      throw new Error('仓库不存在');
    }
    if (!(await fs.exists(workspace.path))) {
      throw new Error('找不到仓库所在文件夹');
    }
    const deleted = join(workspace.path, 'deleted');
    if (!(await fs.exists(deleted))) {
      await fs.mkdir(deleted);
    }
    const temp = join(workspace.path, 'temp');
    if (!(await fs.exists(temp))) {
      await fs.mkdir(temp);
    }
    const comicDirPath = join(workspace.path, comic.id);
    const files = await fs.readdir(comicDirPath);
    const comicName = files.find(o => o.endsWith('.zip'));
    if (!comicName) {
      throw new Error('压缩文件丢失');
    }
    return {
      tempPath: join(temp, comic.id),
      deletedPath: join(deleted, comic.id),
      comicDirPath: comicDirPath,
      comicPath: join(comicDirPath, comicName),
      comicName,
    };
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

  async countTags(type: string, selectTags?: Omit<GetComicRequestQuery, 'offset'>) {
    let match = { $match: {} };
    if (selectTags) {
      Object.keys(selectTags).forEach(key => {
        const keys = selectTags[key];
        if (Array.isArray(keys) && keys.length > 0) {
          match.$match[key] = {
            $all: keys,
          };
        }
      });
    }

    const response = await this.ctx.model.Comic.aggregate([
      match,
      { $project: { _id: 0, [type]: 1 } },
      { $unwind: `$${type}` },
      {
        $group: {
          _id: `$${type}`,
          count: { $sum: 1 },
        },
      },
    ]);
    return response.map(({ _id: id, count }) => ({ id, count })).sort((a, b) => b.count - a.count);
  }
}
