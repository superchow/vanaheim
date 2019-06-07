export interface MenuNode {
  name: string;
  icon: string;
  path: string;
}
export interface SubMenu {
  name: string;
  icon: string;
  children: (SubMenu | MenuNode)[];
}

export type Menu = MenuNode | SubMenu;

export function isSubMenu(menu: Menu): menu is SubMenu {
  if ((menu as SubMenu).children) {
    return true;
  }
  return false;
}

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
      {
        name: '标签',
        icon: 'tags',
        children: [
          {
            name: '全部',
            icon: 'tags',
            path: '/comic/tags',
          },
        ],
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
