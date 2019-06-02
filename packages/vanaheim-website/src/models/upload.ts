import { DvaModelBuilder } from 'dva-model-creator';
import { asyncUploadComic } from '@/actions/upload';
import { addComic } from '@/service/comic';

const builder = new DvaModelBuilder(0, 'upload');

builder.takeEvery(asyncUploadComic, function*({ info, cover, fileList }, { call }) {
  yield call(addComic, info, cover, fileList);
});

export default builder.build();
