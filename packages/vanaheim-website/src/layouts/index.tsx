import React, { useState } from 'react';
import { Layout, Menu, Icon, PageHeader } from 'antd';
import menuCreator, { Menu as IMenu, isSubMenu, defaultOpenKeys } from 'common/menus';
import { connect } from 'dva';
import { GlobalState, UmiComponentProps } from '@/common/types';
import { SelectParam } from 'antd/lib/menu';
import styles from './index.scss';
import pageHeaderInfo from 'common/pageHeaderInfo';

const { Content, Sider } = Layout;

const mapStateToProps = ({ bookshelf }: GlobalState) => ({ bookshelf });
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & UmiComponentProps;

const renderMenu = (menu: IMenu) => {
  if (isSubMenu(menu)) {
    return (
      <Menu.SubMenu
        key={menu.name}
        title={
          <span>
            <Icon type={menu.icon} />
            <span>{menu.name}</span>
          </span>
        }
      >
        {menu.children.map(c => renderMenu(c))}
      </Menu.SubMenu>
    );
  }
  return (
    <Menu.Item key={menu.path}>
      <Icon type={menu.icon} />
      <span>{menu.name}</span>
    </Menu.Item>
  );
};

const BasicLayout: React.FC<PageProps> = ({ bookshelf, history, children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleSelectMenu = (e: SelectParam) => {
    history.push(e.key);
  };

  const handleRenderSider = () => {
    let selectedKeys: string[] = [`${location.pathname}${location.search}`];
    return (
      <Sider
        className={styles.sider}
        collapsed={collapsed}
        collapsible
        onCollapse={setCollapsed}
        breakpoint="md"
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          onSelect={handleSelectMenu}
          defaultOpenKeys={defaultOpenKeys}
        >
          {menuCreator(bookshelf.list).map(renderMenu)}
        </Menu>
      </Sider>
    );
  };

  const title = pageHeaderInfo[history.location.pathname];

  return (
    <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
      {handleRenderSider()}
      <Layout>
        <Content className={styles.content}>
          {title && <PageHeader title={title.title} />}
          <div style={{ padding: 20 }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default connect(mapStateToProps)(React.memo(BasicLayout));
