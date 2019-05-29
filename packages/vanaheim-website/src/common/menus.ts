import { formatMessage } from 'umi-plugin-locale';

export default [
  { name: formatMessage({ id: 'Home' }), icon: 'home', path: '/' },
  { name: formatMessage({ id: 'Workspace' }), icon: 'folder', path: '/workspace' },
];
