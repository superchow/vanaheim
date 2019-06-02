// This file is created by egg-ts-helper@1.25.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportComic from '../../../app/controller/Comic';
import ExportWorkspace from '../../../app/controller/Workspace';

declare module 'egg' {
  interface IController {
    comic: ExportComic;
    workspace: ExportWorkspace;
  }
}
