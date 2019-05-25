import { formatMessage } from 'umi-plugin-locale';

export default [
  { name: formatMessage({ id: 'menu.home' }), icon: 'home', path: '/' },
  { name: formatMessage({ id: 'menu.workspace' }), icon: 'folder', path: '/workspace' },
];
