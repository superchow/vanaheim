import { Service } from 'egg';
import * as fs from 'mz/fs';
import { join } from 'path';

export default class WorkspaceService extends Service {
  async add(name: string, path: string) {
    if (!(await fs.exists(path))) {
      throw new Error('文件夹不存在');
    }
    return this.ctx.model.Workspace.create({
      name,
      path,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    });
  }

  async list() {
    const response = await this.ctx.model.Workspace.find();
    return Promise.all(
      response.map(async ({ name, path, createdAt, modifiedAt, _id: id }) => {
        const status = await fs.exists(path);
        return {
          id,
          name,
          path,
          status,
          createdAt,
          modifiedAt,
        };
      })
    );
  }

  async delete(id: string) {
    const response = await this.ctx.model.Workspace.deleteOne({
      _id: id,
    });
    console.log('delete', response);
  }

  async listFile(parent = '/') {
    if (!fs.exists(parent)) {
      return [];
    }
    const children = await fs.readdir(parent);
    return (await Promise.all(
      children.map(async fileName => {
        const filePath = join(parent, fileName);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory() && !fileName.startsWith('.')) {
          let empty;
          try {
            empty = (await fs.readdir(`${parent}${fileName}`)).length === 0;
          } catch (error) {
            this.ctx.logger.info(error);
            empty = false;
          }
          return {
            name: fileName,
            empty,
          };
        }
        return null;
      })
    )).filter((file): file is { name: string; empty: boolean } => !!file);
  }
}
