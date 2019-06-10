export interface MenuNode {
  name: string;
  icon?: string;
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

export const defaultOpenKeys = ['漫画', '标签', '设置'];

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
            path: '/comic/tags',
          },
          {
            name: '作家',
            path: '/comic/tags?tags=artist',
          },
          {
            name: '团体',
            path: '/comic/tags?tags=group',
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
