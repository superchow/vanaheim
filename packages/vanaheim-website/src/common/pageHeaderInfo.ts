interface PageHeaderInfo {
  [pathname: string]: {
    title: string;
  };
}

export default {
  '/workspace': { title: '仓库' },
  '/upload': { title: '上传' },
  '/comic/recent': { title: '最近添加' },
  '/comic/bookshelf': { title: '书架' },
} as PageHeaderInfo;
