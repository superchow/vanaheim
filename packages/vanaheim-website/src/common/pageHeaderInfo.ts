interface PageHeaderInfo {
  [pathname: string]: {
    title: string;
  };
}

export default {
  '/workspace': { title: '仓库' },
  '/upload': { title: '上传' },
  '/comic': { title: '漫画' },
} as PageHeaderInfo;
