import {
  AddWorkspaceRequest,
  ListWorkspaceResponse,
  AddWorkspaceResponse,
  ListFileResponse,
} from 'vanaheim-shared';
import { extend } from 'umi-request';

const request = extend({
  maxCache: 10,
  prefix: 'http://127.0.0.1:7001/api/',
});

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
