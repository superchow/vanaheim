import { DvaModelBuilder } from 'dva-model-creator';
import { GlobalState } from '@/common/types';
import { asyncGetComic, setList, asyncFetchTags, asyncDeleteComic } from '@/actions/comic';
import { getComic, getComicTags, deleteComicById } from '@/service/comic';
import { GetComicRequestResponse, GetComicTagsResponse } from 'vanaheim-shared';
import update from 'immutability-helper';
import { DeleteComicResponse } from 'vanaheim-shared/src';
import { message } from 'antd';

const initState: GlobalState['comic'] = {
  list: [],
  tags: {},
};

const builder = new DvaModelBuilder(initState, 'comic');

builder.takeEvery(asyncDeleteComic, function*(id, { call, put, select }) {
  const response: DeleteComicResponse = yield call(deleteComicById, id);
  if (!response) {
    return;
  }
  const global: GlobalState = yield select(state => state);
  yield put(setList(global.comic.list.filter(o => o.id !== id)));
  message.destroy();
  message.success('删除成功');
});

builder.takeEvery(asyncGetComic, function*(query, { call, put }) {
  const response: GetComicRequestResponse = yield call(getComic, query);
  if (!response) {
    return;
  }
  yield put(setList(response.data));
});

builder.takeEvery(asyncFetchTags.started, function*(query, { call, put }) {
  const response: GetComicTagsResponse = yield call(getComicTags, query);
  if (!response) {
    return;
  }
  yield put(
    asyncFetchTags.done({
      params: query,
      result: response,
    })
  );
});

builder.case(asyncFetchTags.done, (state, { result }) =>
  update(state, {
    tags: {
      $set: result.data,
    },
  })
);

builder.case(setList, (state, list) =>
  update(state, {
    list: {
      $set: list,
    },
  })
);

export default builder.build();
