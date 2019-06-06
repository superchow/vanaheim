import { AddComicFormInfo, ComicSite, ComicRawInfo } from 'vanaheim-shared';
import { actionCreatorFactory } from 'dva-model-creator';
import { SearchComicRawInfoRequest } from 'vanaheim-shared/src';

const actionCreator = actionCreatorFactory('upload');

export const asyncUploadComic = actionCreator<{
  info: AddComicFormInfo;
  cover: File;
  fileList: File[];
  callback: Function;
}>('ASYNC_UPLOAD_COMIC');

export const asyncSearchComic = actionCreator<SearchComicRawInfoRequest>('ASYNC_SEARCH_Comic');

export const setComicRawInfo = actionCreator<{ type: ComicSite; data: ComicRawInfo[] }>(
  'SET_COMIC_RAW_INFO'
);
