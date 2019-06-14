import update from 'immutability-helper';
import {
  CreateBookshelfResponse,
  FetchBookshelfResponse,
  FetchBookshelfDetailResponse,
} from 'vanaheim-shared';
import { DvaModelBuilder } from 'dva-model-creator';
import { GlobalState } from '@/common/types';
import {
  asyncCreateBookshelf,
  asyncFetchBookshelf,
  asyncDeleteBookshelf,
  asyncBookshelfAddComic,
  asyncFetchBookshelfDetail,
  cleanBookshelfDetail,
} from '@/actions/bookshelf';
import {
  createBookShelfRequest,
  fetchBookshelf,
  deleteBookshelf,
  bookshelfAddComic,
  fetchBookshelfDetail,
} from '@/service/bookshelf';
import { isUndefined } from 'util';
import { message } from 'antd';

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

builder.takeEvery(asyncBookshelfAddComic, function*({ bookshelfId, comicId }, { call }) {
  const response = yield call(bookshelfAddComic, bookshelfId, comicId);
  if (isUndefined(response)) {
    return;
  }
  message.success('添加成功');
});

builder
  .takeEvery(asyncFetchBookshelfDetail.started, function*({ bookshelfId }, { call, put }) {
    const response: FetchBookshelfDetailResponse = yield call(fetchBookshelfDetail, bookshelfId);
    if (!response) {
      return;
    }
    yield put(
      asyncFetchBookshelfDetail.done({
        params: { bookshelfId },
        result: response.data,
      })
    );
  })
  .case(asyncFetchBookshelfDetail.done, (state, { result }) =>
    update(state, {
      detail: {
        $set: result,
      },
    })
  )
  .case(cleanBookshelfDetail, ({ detail, ...rest }) => ({
    ...rest,
  }));

builder.subscript(function loadBookshelf({ dispatch }) {
  dispatch(asyncFetchBookshelf.started());
});

export default builder.build();
