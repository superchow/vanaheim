import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, PageHeader } from 'antd';
import menus from 'common/menus';
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

  handleRenderSider = () => {
    const { history } = this.props;
    let selectedKeys: string[] = [history.location.pathname];
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
          defaultOpenKeys={menus.map(o => o.name)}
        >
          {menus.map(({ icon, name, children }) => (
            <Menu.SubMenu
              key={name}
              title={
                <span>
                  <Icon type={icon} />
                  <span>{name}</span>
                </span>
              }
            >
              {children.map(c => (
                <Menu.Item key={c.path}>
                  <Icon type={c.icon} />
                  <span>{c.name}</span>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ))}
        </Menu>
      </Sider>
    );
  };

  render() {
    const title = pageHeaderInfo[this.props.history.location.pathname];
    return (
      <Layout>
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
