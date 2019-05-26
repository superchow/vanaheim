import { Service } from 'egg';
import * as fs from 'mz/fs';

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
    return this.ctx.model.Workspace.find();
  }
}
