import { WorkspaceWithId, AddWorkspaceRequest } from 'vanaheim-shared';
import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('workspace');

export const asyncListWorkspace = actionCreator('ASYNC_LIST_WORKSPACE');

export const asyncDeleteWorkspace = actionCreator<{ id: string }>('ASYNC_DELETE_WORKSPACE');

export const setWorkspace = actionCreator<WorkspaceWithId[]>('SET_WORKSPACE');

export const asyncAddWorkspace = actionCreator<AddWorkspaceRequest & { callback(): void }>(
  'ASYNC_ADD_WORKSPACE'
);
