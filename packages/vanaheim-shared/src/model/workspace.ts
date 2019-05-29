import { BaseResponse } from './../index';
export interface Workspace {
  name: string;
  path: string;
  status: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface WorkspaceWithId extends Workspace {
  id: string;
}

export type AddWorkspaceRequest = {
  name: string;
  path: string;
};

export type AddWorkspaceResponse = BaseResponse<WorkspaceWithId>;

export type ListWorkspaceResponse = BaseResponse<WorkspaceWithId[]>;

export type DeleteWorkspaceRequest = {
  id: string;
};

export type FileType = {
  name: string;
  empty: boolean;
};

export type ListFileResponse = BaseResponse<FileType[]>;
