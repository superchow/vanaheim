// This file is created by egg-ts-helper@1.25.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportComic from '../../../app/service/Comic';
import ExportCrawler from '../../../app/service/Crawler';
import ExportWorkspace from '../../../app/service/Workspace';

declare module 'egg' {
  interface IService {
    comic: ExportComic;
    crawler: ExportCrawler;
    workspace: ExportWorkspace;
  }
}
