import { DvaModelBuilder } from 'dva-model-creator';
import { asyncUploadComic } from '@/actions/upload';
import { addComic } from '@/service/comic';
import { message } from 'antd';

const builder = new DvaModelBuilder(0, 'upload');

builder.takeEvery(asyncUploadComic, function*({ info, cover, fileList, callback }, { call }) {
  const response = yield call(addComic, info, cover, fileList);
  if (!response) {
    return;
  }
  message.success('导入成功');
  callback();
});

export default builder.build();
