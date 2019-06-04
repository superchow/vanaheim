import { AddComicFormInfo } from 'vanaheim-shared';
import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('upload');

export const asyncUploadComic = actionCreator<{
  info: AddComicFormInfo;
  cover: File;
  fileList: File[];
  callback: Function;
}>('ASYNC_UPLOAD_COMIC');
