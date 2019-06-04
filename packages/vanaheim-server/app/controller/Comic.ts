import { Controller } from 'egg';
import { zip } from 'compressing';
import * as fs from 'mz/fs';
import { join } from 'path';
import * as mongoose from 'mongoose';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { GetComicRequestQuery, GetComicRequestResponse } from 'vanaheim-shared';

export default class ComicController extends Controller {
  async artist() {
    const { ctx } = this;
    ctx.body = await this.ctx.model.Comic.aggregate([
      { $project: { _id: 0, artist: 1 } },
      { $unwind: '$artist' },
      {
        $group: {
          _id: '$artist',
          count: { $sum: 1 },
        },
      },
    ]);
  }

  public async list() {
    const { ctx } = this;
    const body: GetComicRequestQuery = ctx.query;
    const response = await this.service.comic.list(body);
    ctx.body = {
      data: response.map(({ _id, title, titleOriginal, read }) => ({
        id: _id,
        title,
        titleOriginal,
        read,
      })),
    } as GetComicRequestResponse;
  }

  public async cover() {
    const { ctx } = this;
    const id = ctx.params.id;
    if (!id) {
      ctx.status = 404;
      return;
    }
    const comic = await this.service.comic.findById(id);
    if (!comic) {
      ctx.status = 401;
      ctx.body = {
        message: '漫画不存在',
      };
      return;
    }
    ctx.set('Content-type', 'image/jpg');
    ctx.body = comic.cover;
  }

  public async add() {
    const { ctx } = this;
    const parts = ctx.multipart();
    let part;
    const tarStream = new zip.Stream();
    let cover;
    let data: { [key: string]: string } = {};
    while ((part = await parts()) != null) {
      if (part.length) {
        data[part[0]] = part[1];
      } else {
        if (!part.filename) {
          return;
        }
        if (part.fieldname === 'cover') {
          cover = await readStream(part);
        } else {
          tarStream.addEntry(part, {
            relativePath: part.filename,
          });
        }
      }
    }

    function arrayStringParser(arrayString: string) {
      if (!arrayString) {
        return [];
      }
      try {
        const array = JSON.parse(arrayString);
        if (Array.isArray(array) && array.every(o => typeof o === 'string')) {
          return array;
        }
        if (typeof array === 'string') {
          return [array];
        }
        return [];
      } catch (_error) {
        return [];
      }
    }
    const formInfo = {
      title: data.title,
      titleOriginal: data.titleOriginal,
      group: data.group,
      artist: arrayStringParser(data.artist),
      tags: arrayStringParser(data.tags),
      parody: arrayStringParser(data.parody),
      workspaceId: data.workspaceId,
    };
    const { workspaceId, title, artist } = formInfo;
    if (!workspaceId) {
      ctx.data = {
        message: '请选择仓库',
      };
      return;
    }
    const workspace = await this.service.workspace.getById(workspaceId);
    if (!workspace || !(await fs.exists(workspace.path))) {
      ctx.status = 400;
      ctx.body = {
        message: '仓库不存在',
      };
      return;
    }
    if (!title || artist.length === 0) {
      ctx.status = 400;
      ctx.body = {
        message: '标题和作者必须存在',
      };
      return;
    }
    const comic = await this.service.comic.add(formInfo, cover);
    let id = mongoose.Types.ObjectId(comic._id).toString();
    const comicFolder = join(workspace.path, id);
    if (!(await fs.exists(comicFolder))) {
      await fs.mkdir(comicFolder);
    }
    const destStream = fs.createWriteStream(
      join(comicFolder, `[${artist.join(`、`)}] ${data.title}.zip`)
    );
    await promisify(pipeline)(tarStream, destStream);
    ctx.body = {
      data,
    };
  }
}

function readStream(part: any) {
  return new Promise((resolve, reject) => {
    let buffers: any[] = [];
    part.on('data', chunk => {
      buffers.push(chunk);
    });
    part.once('end', () => {
      let buffer = Buffer.concat(buffers);
      resolve(buffer);
    });
    part.once('error', err => {
      reject(err);
    });
  });
}
