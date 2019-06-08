import { DvaModelBuilder } from 'dva-model-creator';
import { GlobalState } from '@/common/types';
import { asyncGetComic, setList, asyncFetchTags, asyncDeleteComic } from '@/actions/comic';
import { getComic, getComicTags, deleteComicById } from '@/service/comic';
import { GetComicRequestResponse, GetComicTagsResponse } from 'vanaheim-shared';
import update from 'immutability-helper';

const initState: GlobalState['comic'] = {
  list: [],
  tags: {},
};

const builder = new DvaModelBuilder(initState, 'comic');

builder.takeEvery(asyncDeleteComic, function*(id, { call }) {
  const response: GetComicRequestResponse = yield call(deleteComicById, id);
  if (!response) {
    return;
  }
  console.log(response);
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
      result: {
        tags: response.data,
      },
    })
  );
});

builder.case(asyncFetchTags.done, (state, { params, result }) =>
  update(state, {
    tags: {
      [params.type]: {
        $set: result.tags,
      },
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
