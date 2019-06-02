import { setList } from './../../actions/comic';
import { DvaModelBuilder } from 'dva-model-creator';
import { GlobalState } from '@/common/types';
import { asyncGetComic } from '@/actions/comic';
import { getComic } from '@/service/comic';
import { GetComicRequestResponse } from 'vanaheim-shared/src';
import { message } from 'antd';

const initState: GlobalState['comic'] = {
  list: [],
};

const builder = new DvaModelBuilder(initState, 'comic');

builder.takeEvery(asyncGetComic, function*(query, { call, put }) {
  const response: GetComicRequestResponse = yield call(getComic, query);
  if (response.message) {
    message.error(message);
    return;
  }
  yield put(setList(response.data));
});

builder.case(setList, (state, list) => ({
  ...state,
  list,
}));

export default builder.build();
