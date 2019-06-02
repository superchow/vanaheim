export default [
  {
    name: '漫画',
    icon: 'picture',
    children: [
      {
        name: '最近添加',
        icon: 'calendar',
        path: '/comic/recent',
      },
    ],
  },
  {
    name: '设置',
    icon: 'setting',
    children: [
      {
        name: '添加',
        icon: 'upload',
        path: '/upload',
      },
      { name: '仓库', icon: 'folder', path: '/workspace' },
    ],
  },
];
