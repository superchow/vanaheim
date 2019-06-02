// This file is created by egg-ts-helper@1.25.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportComic from '../../../app/model/Comic';
import ExportWorkspace from '../../../app/model/Workspace';

declare module 'egg' {
  interface IModel {
    Comic: ReturnType<typeof ExportComic>;
    Workspace: ReturnType<typeof ExportWorkspace>;
  }
}
