import { BaseResponse } from '../index';
export enum ComicSite {
  NHentai = 'NHentai',
  EHentai = 'EHentai',
}

export interface ComicRawInfo {
  title: string;
  titleOriginal: string;
  cover: string;
  rate: number;
  reclass: string;
  character: string[];
  /**
   * 原作
   */
  parody: string[];
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
  language: string[];
}

export interface SearchComicRawInfoRequest {
  type: ComicSite;
  keyword: string;
}

export type SearchComicRawInfoResponse = BaseResponse<ComicRawInfo[]>;
