import { Service } from 'egg';
import * as fs from 'mz/fs';
import { join } from 'path';

export default class FileService extends Service {
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
          return fileName;
        }
        return null;
      })
    )).filter((file): file is string => !!file);
  }
}
