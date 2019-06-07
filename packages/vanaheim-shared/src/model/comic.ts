import { Parody } from './parody';
import { BaseResponse } from './../index';

export interface Comic {
  id: string;
  title: string;
  titleOriginal: string;
  cover: Buffer;
  rate: number;
  reclass: string;
  character: string[];
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

export interface ComicListNode {
  id: string;
  title: string;
  titleOriginal: string;
  read: boolean;
}

export interface AddComicFormInfo {
  title: string;
  titleOriginal: string;
  parody: string[];
  group: string;
  artist: string[];
  tags: string[];
  rate: number;
  reclass: string;
  character: string[];
  workspaceId: string;
}

export interface GetComicRequestQuery {
  offset: number;
  pageSize: number;
}

export type GetComicRequestResponse = BaseResponse<ComicListNode[]>;

export type TagType =
  | 'tags'
  | 'artist'
  | 'group'
  | 'parody'
  | 'character'
  | 'reclass'
  | 'workspaceId';

export interface GetComicTagsQuery {
  type: TagType;
}

export interface ComicTags {
  id: string;
  count: number;
}

export type GetComicTagsResponse = BaseResponse<ComicTags[]>;
