// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportWorkspace from '../../../app/model/Workspace';

declare module 'egg' {
  interface IModel {
    Workspace: ReturnType<typeof ExportWorkspace>;
  }
}
