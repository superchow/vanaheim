import { Controller } from 'egg';
import { zip } from 'compressing';
import { MultipartFileStream } from 'egg-multipart';
import { AddComicFormInfo } from 'vanaheim-shared/lib/model/comic';
import * as fs from 'mz/fs';
import { join } from 'path';
import * as mongoose from 'mongoose';
import { promisify } from 'util';
import { pipeline } from 'stream';

export default class ComicController extends Controller {
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
          cover = await toBase64(part);
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
      image: cover,
    };
  }
}

const toBase64 = (stream: MultipartFileStream) => {
  return new Promise(r => {
    let data = '';
    let chunk;
    stream.on('readable', function() {
      while ((chunk = stream.read()) != null) {
        data += chunk.toString('base64');
      }
    });
    stream.on('end', function() {
      r(`data:${stream.mimeType};base64,${data}`);
    });
  });
};
