import { Bookshelf } from 'vanaheim-shared';
import update from 'immutability-helper';
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

export const defaultOpenKeys = ['漫画', '标签', '设置', '书架', '全部书架'];

const originMenu: SubMenu[] = [
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
    name: '书架',
    icon: 'book',
    children: [
      {
        name: '编辑书架',
        icon: 'book',
        path: '/comic/bookshelf',
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

export default function menuCreator(bookshelf: Bookshelf[]) {
  if (bookshelf.length > 0) {
    const bookshelfMenu: SubMenu = {
      name: '全部书架',
      icon: 'book',
      children: bookshelf.map(o => ({
        name: o.title,
        path: `/comic/bookshelf/${o.id}`,
      })),
    };
    return update(originMenu, {
      1: {
        children: {
          1: {
            $set: bookshelfMenu,
          },
        },
      },
    });
  }
  return originMenu;
}
