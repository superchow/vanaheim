import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import menus from 'common/menus';
import { connect } from 'dva';
import { GlobalState, UmiComponentProps } from '@/common/types';
import { bindActionCreators, Dispatch } from 'redux';
import { SelectParam } from 'antd/lib/menu';
import styles from './index.scss';

const { Content, Sider } = Layout;

const mapStateToProps = (state: GlobalState) => state;

const useActions = {};

type PageStateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: bindActionCreators<PageDispatchProps, PageDispatchProps>(useActions, dispatch),
});
type PageDispatchProps = typeof useActions;
type PageProps = PageStateProps & {
  actions: PageDispatchProps;
} & UmiComponentProps;

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
        >
          {menus.map(({ icon, name, path }) => (
            <Menu.Item key={path}>
              <Icon type={icon} />
              <span>{name}</span>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    );
  };

  render() {
    return (
      <Layout>
        {this.handleRenderSider()}
        <Layout>
          <Content className={styles.content}>{this.props.children}</Content>
        </Layout>
      </Layout>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicLayout);
