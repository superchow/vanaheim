import { DvaModelBuilder } from 'dva-model-creator';
import { GlobalState } from '@/common/types';
import { asyncListFile, setTreeData } from '@/actions/workspaceModal';
import { listFile } from '@/service/workspace';
import { ListFileResponse } from 'vanaheim-shared';
import { TreeNodeNormal } from 'antd/lib/tree-select/interface';

const initState: GlobalState['workspaceModal'] = {
  treeData: [],
};

const builder = new DvaModelBuilder(initState, 'workspaceModal');

function getParentNode(treeNodes: TreeNodeNormal[], parentKey: string): TreeNodeNormal | null {
  for (const node of treeNodes) {
    if (node.key === parentKey) {
      return node;
    }
    if (parentKey.startsWith(`${node.key}`)) {
      return getParentNode(node.children!, parentKey);
    }
  }
  return null;
}

builder.takeEvery(asyncListFile, function*(parent: string, { put, select }) {
  const {
    workspaceModal: { treeData },
  }: GlobalState = yield select(state => state);
  if (treeData.length === 0) {
    const response: ListFileResponse = yield listFile(parent);
    const treeData: TreeNodeNormal[] = response.data.map(({ name, empty }) => ({
      title: name,
      value: `${parent}${name}/`,
      key: `${parent}${name}/`,
      isLeaf: empty,
    }));
    yield put(setTreeData(treeData));
  } else {
    const parentNode = getParentNode(treeData, parent);
    if (parentNode && !parentNode.children) {
      const response: ListFileResponse = yield listFile(parent);
      parentNode.children = response.data.map(({ name, empty }) => ({
        title: name,
        value: `${parent}${name}/`,
        key: `${parent}${name}/`,
        isLeaf: empty,
      }));
      yield put(setTreeData(treeData));
    }
  }
});

builder.case(setTreeData, (state, treeData) => {
  return {
    ...state,
    treeData,
  };
});

export default builder.build();
