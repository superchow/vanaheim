import { request } from './index';
import {
  AddWorkspaceRequest,
  ListWorkspaceResponse,
  AddWorkspaceResponse,
  ListFileResponse,
} from 'vanaheim-shared';

export function addWorkspace(data: AddWorkspaceRequest) {
  return request.post<AddWorkspaceResponse>('v1/workspace', { data });
}

export function listWorkspace() {
  return request.get<ListWorkspaceResponse>('v1/workspace');
}

export function deleteWorkspace(id: string) {
  return request.delete('v1/workspace', {
    data: { id },
  });
}

export function listFile(parent: string) {
  return request.get<ListFileResponse>(`v1/workspace/file?parent=${parent}`);
}
