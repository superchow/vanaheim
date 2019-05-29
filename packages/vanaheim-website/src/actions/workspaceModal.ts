import { actionCreatorFactory } from 'dva-model-creator';
import { GlobalState } from '@/common/types';

const actionCreator = actionCreatorFactory('workspaceModal');

export const asyncListFile = actionCreator<string>('ASYNC_LIST_FILE');

export const setTreeData = actionCreator<GlobalState['workspaceModal']['treeData']>(
  'SET_TREE_DATE'
);
