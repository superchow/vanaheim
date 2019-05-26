// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportComic from '../../../app/model/Comic';
import ExportUser from '../../../app/model/User';
import ExportWorkspace from '../../../app/model/Workspace';

declare module 'egg' {
  interface IModel {
    Comic: ReturnType<typeof ExportComic>;
    User: ReturnType<typeof ExportUser>;
    Workspace: ReturnType<typeof ExportWorkspace>;
  }
}
