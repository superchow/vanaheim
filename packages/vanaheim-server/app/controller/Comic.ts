import { Controller } from 'egg';
import { zip } from 'compressing';
import { AddComicFormInfo } from 'vanaheim-shared/lib/model/comic';
import * as fs from 'mz/fs';
import { join } from 'path';
import * as mongoose from 'mongoose';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { GetComicRequestQuery, GetComicRequestResponse } from 'vanaheim-shared';

export default class ComicController extends Controller {
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
    let data: Partial<AddComicFormInfo> = {};
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
    if (!data.workspaceId) {
      throw new Error('workspaceId is required');
    }
    const workspace = await this.service.workspace.getById(data.workspaceId);
    if (!workspace || !(await fs.exists(workspace.path))) {
      throw new Error('仓库不存在');
    }
    if (!data.title || !data.artist) {
      throw new Error('标题和作者必须存在');
    }
    const comic = await this.service.comic.add(data, cover);
    let id = mongoose.Types.ObjectId(comic._id).toString();
    const comicFolder = join(workspace.path, id);
    if (!(await fs.exists(comicFolder))) {
      await fs.mkdir(comicFolder);
    }
    const destStream = fs.createWriteStream(
      join(comicFolder, `[${data.artist}] ${data.title}.zip`)
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
