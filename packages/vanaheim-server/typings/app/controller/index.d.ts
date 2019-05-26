// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportFile from '../../../app/controller/File';
import ExportWorkspace from '../../../app/controller/Workspace';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    file: ExportFile;
    workspace: ExportWorkspace;
    user: ExportUser;
  }
}
