import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, PageHeader } from 'antd';
import menus, { Menu as IMenu, isSubMenu, defaultOpenKeys } from 'common/menus';
import { connect } from 'dva';
import { GlobalState, UmiComponentProps } from '@/common/types';
import { SelectParam } from 'antd/lib/menu';
import styles from './index.scss';
import pageHeaderInfo from 'common/pageHeaderInfo';

const { Content, Sider } = Layout;

const mapStateToProps = (state: GlobalState) => state;
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & UmiComponentProps;

class BasicLayout extends PureComponent<PageProps> {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  };

  handleSelectMenu = (e: SelectParam) => {
    this.props.history.push(e.key);
  };

  renderMenu = (menu: IMenu) => {
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
          {menu.children.map(c => this.renderMenu(c))}
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

  handleRenderSider = () => {
    const {
      history: { location },
    } = this.props;
    let selectedKeys: string[] = [`${location.pathname}${location.search}`];
    return (
      <Sider
        className={styles.sider}
        collapsed={this.state.collapsed}
        collapsible
        onCollapse={this.onCollapse}
        breakpoint="md"
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          onSelect={this.handleSelectMenu}
          defaultOpenKeys={defaultOpenKeys}
        >
          {menus.map(o => this.renderMenu(o))}
        </Menu>
      </Sider>
    );
  };

  render() {
    const title = pageHeaderInfo[this.props.history.location.pathname];
    const { collapsed } = this.state;
    return (
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        {this.handleRenderSider()}
        <Layout>
          <Content className={styles.content}>
            {title && <PageHeader title={title.title} />}
            <div style={{ padding: 20 }}>{this.props.children}</div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default connect(mapStateToProps)(BasicLayout);
