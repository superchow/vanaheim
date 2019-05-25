// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportComic from '../../../app/controller/Comic';
import ExportFile from '../../../app/controller/File';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    comic: ExportComic;
    file: ExportFile;
    user: ExportUser;
  }
}
