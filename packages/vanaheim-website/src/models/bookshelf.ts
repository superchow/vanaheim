import { asyncFetchBookshelf, asyncDeleteBookshelf } from './../actions/bookshelf';
import update from 'immutability-helper';
import { CreateBookshelfResponse, FetchBookshelfResponse } from 'vanaheim-shared';
import { DvaModelBuilder } from 'dva-model-creator';
import { GlobalState } from '@/common/types';
import { asyncCreateBookshelf } from '@/actions/bookshelf';
import { createBookShelfRequest, fetchBookshelf, deleteBookshelf } from '@/service/bookshelf';
import { isUndefined } from 'util';

const initState: GlobalState['bookshelf'] = {
  list: [],
};

const builder = new DvaModelBuilder(initState, 'bookshelf')
  .takeEvery(asyncCreateBookshelf.started, function*({ callback, title }, { call, put }) {
    const response: CreateBookshelfResponse = yield call(createBookShelfRequest, { title });
    if (!response) {
      return;
    }
    callback();
    yield put(asyncCreateBookshelf.done({ params: { title, callback }, result: response.data }));
  })
  .case(asyncCreateBookshelf.done, (state, { result }) =>
    update(state, {
      list: {
        $push: [result],
      },
    })
  );

builder
  .takeEvery(asyncDeleteBookshelf.started, function*({ id }, { call, put }) {
    const response = yield call(deleteBookshelf, id);
    if (isUndefined(response)) {
      return;
    }
    yield put(
      asyncDeleteBookshelf.done({
        params: { id },
      })
    );
  })
  .case(asyncDeleteBookshelf.done, (state, { params: { id } }) =>
    update(state, {
      list: {
        $set: state.list.filter(o => o.id !== id),
      },
    })
  );

builder
  .takeEvery(asyncFetchBookshelf.started, function*(_, { call, put }) {
    const response: FetchBookshelfResponse = yield call(fetchBookshelf);
    if (!response) {
      return;
    }
    yield put(
      asyncFetchBookshelf.done({
        result: response.data,
      })
    );
  })
  .case(asyncFetchBookshelf.done, (state, { result }) =>
    update(state, {
      list: {
        $set: result,
      },
    })
  );

builder.subscript(function loadBookshelf({ dispatch }) {
  dispatch(asyncFetchBookshelf.started());
});

export default builder.build();
