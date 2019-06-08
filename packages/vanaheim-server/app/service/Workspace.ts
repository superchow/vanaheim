import { Service } from 'egg';
import * as fs from 'mz/fs';
import { join } from 'path';

export default class WorkspaceService extends Service {
  async add(name: string, path: string) {
    if (!(await fs.exists(path))) {
      throw new Error('创建失败，文件夹不存在');
    }
    const workspaces = await this.ctx.model.Workspace.find({});
    if (workspaces.some(o => path.startsWith(o.path))) {
      throw new Error('创建失败，仓库之间不能重叠');
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
        const status = path ? await fs.exists(path) : false;
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
    const workspace = await this.ctx.model.Workspace.findById({
      _id: id,
    });
    if (workspace) {
      if (await fs.exists(workspace.path)) {
        const files = (await fs.readdir(workspace.path)).filter(o => o !== '.DS_Store');
        if (files.length !== 0) {
          throw new Error('删除失败，仓库不为空');
        }
        if (files.length === 0) {
          await fs.unlink(join(workspace.path, '.DS_Store'));
        }
        await fs.rmdir(workspace.path);
      }
    }
    await this.ctx.model.Workspace.deleteOne({
      _id: id,
    });
  }

  async getById(id: string) {
    return this.ctx.model.Workspace.findOne({
      _id: id,
    });
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
