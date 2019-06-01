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
  /**
   * 团体
   */
  group: string;
  /**
   * 作者
   */
  artist: string[];
  /**
   * 标签
   */
  tags: string[];
  /**
   * 文件大小
   */
  fileSize: number;
}