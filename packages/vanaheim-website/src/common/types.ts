import {
  WorkspaceWithId,
  ComicTags,
  ComicRawInfo,
  ComicListNode,
  Bookshelf,
} from 'vanaheim-shared';
import { History } from 'history';
import { Dispatch } from 'react';
import { TreeNodeNormal } from 'antd/lib/tree-select/interface';

export interface GlobalState {
  workspace: WorkspaceModel;
  loading: DvaLoadingState;
  workspaceModal: WorkspaceModalModel;
  comic: ComicModel;
  bookshelf: BookshelfModel;
  upload: UploadModel;
}

export interface UmiComponentProps {
  history: History;
  dispatch: Dispatch<any>;
}

export interface UploadModel {
  comicInfo: {
    [type: string]: ComicRawInfo[];
  };
}

export interface DvaLoadingState {
  global: boolean;
  models: { [key: string]: boolean };
  effects: { [key: string]: boolean };
}

export interface WorkspaceModel {
  list: WorkspaceWithId[];
}

export interface WorkspaceModalModel {
  treeData: TreeNodeNormal[];
}

export interface ComicModel {
  list: ComicListNode[];
  tags: {
    [type: string]: ComicTags[];
  };
}

export interface BookshelfModel {
  list: Bookshelf[];
}
