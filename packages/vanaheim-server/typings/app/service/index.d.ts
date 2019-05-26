// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportFile from '../../../app/service/File';
import ExportUser from '../../../app/service/User';
import ExportWorkspace from '../../../app/service/Workspace';

declare module 'egg' {
  interface IService {
    file: ExportFile;
    user: ExportUser;
    workspace: ExportWorkspace;
  }
}
