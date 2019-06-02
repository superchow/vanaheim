import { Parody } from './parody';

export interface Comic {
  title: string;
  titleOriginal: string;
  cover: string;
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
  createdAt: string;
  modifiedAt: string;
}

export interface AddComicFormInfo {
  title: string;
  titleOriginal: string;
  parody: string[];
  group: string;
  artist: string;
  tags: string[];
  workspaceId: string;
}
