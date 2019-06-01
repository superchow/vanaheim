import { DvaModelBuilder } from 'dva-model-creator';
import { GlobalState } from '@/common/types';
import {
  asyncListWorkspace,
  setWorkspace,
  asyncDeleteWorkspace,
  asyncAddWorkspace,
} from '@/actions/workspace';
import { listWorkspace, deleteWorkspace, addWorkspace } from '@/service/workspace';
import { ListWorkspaceResponse, AddWorkspaceResponse } from 'vanaheim-shared';
import { message } from 'antd';

const initState: GlobalState['workspace'] = {
  list: [],
};

const builder = new DvaModelBuilder(initState, 'workspace');

builder.takeEvery(asyncListWorkspace, function*(_, { call, put }) {
  const response: ListWorkspaceResponse = yield call(listWorkspace);
  yield put(setWorkspace(response.data));
});

builder.takeEvery(asyncDeleteWorkspace, function*({ id }, { call, put }) {
  const response = yield call(deleteWorkspace, id);
  if (response.message) {
    message.error(message);
    return;
  }
  yield put(asyncListWorkspace());
});

builder.takeEvery(asyncAddWorkspace, function*({ name, path, callback }, { call, put }) {
  const response: AddWorkspaceResponse = yield call(addWorkspace, { name, path });
  if (response.message) {
    message.error(message);
    return;
  }
  callback();
  yield put(asyncListWorkspace());
});

builder.case(setWorkspace, (state, payload) => {
  return {
    ...state,
    list: payload,
  };
});

export default builder.build();
