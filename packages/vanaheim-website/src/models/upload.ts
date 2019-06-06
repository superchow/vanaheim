import { SearchComicRawInfoResponse } from './../../../vanaheim-shared/src/model/site';
import { DvaModelBuilder } from 'dva-model-creator';
import { asyncUploadComic, setComicRawInfo, asyncSearchComic } from '@/actions/upload';
import { addComic, searchComicRawInfo } from '@/service/comic';
import { message } from 'antd';
import { UploadModel } from '@/common/types';
import update from 'immutability-helper';

const initState: UploadModel = {
  comicInfo: {},
};

const builder = new DvaModelBuilder(initState, 'upload');

builder
  .takeEvery(asyncUploadComic, function*({ info, cover, fileList, callback }, { call }) {
    const response = yield call(addComic, info, cover, fileList);
    if (!response) {
      return;
    }
    message.success('导入成功');
    callback();
  })
  .takeEvery(asyncSearchComic, function*(payload, { call, put }) {
    const response: SearchComicRawInfoResponse = yield call(searchComicRawInfo, payload);
    if (!response) {
      return;
    }
    yield put(setComicRawInfo({ type: payload.type, data: response.data }));
  })
  .case(setComicRawInfo, (state, { type, data }) =>
    update(state, {
      comicInfo: {
        [type]: {
          $set: data,
        },
      },
    })
  );

export default builder.build();
