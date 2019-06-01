import { Parody } from './parody';

export interface Comic {
  title: string;
  titleOriginal: string;
  coverUrl: string;
  /**
   * 原作
   */
  parody: Parody[];
  /**
   * 是否阅读
   */
  read: boolean;
  group: string;
  artist: string[];
  /**
   * 文件大小
   */
  fileSize: number;
}
