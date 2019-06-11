import React, { Component } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { Dropdown, Menu, Icon } from 'antd';
import { UmiComponentProps, GlobalState } from '@/common/types';
import { connect } from 'dva';
import { asyncDeleteComic } from '@/actions/comic';

import styles from './ContextMenu.scss';

const mapStateToProps = ({ comic, loading, workspace }: GlobalState) => {
  return {
    comic,
    loading,
    workspace,
  };
};
type ContextMenuProps = {
  comicId: string;
};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = ContextMenuProps & PageStateProps & UmiComponentProps & FormComponentProps;

class ContextMenu extends Component<PageProps> {
  handleDeleteComic = () => {
    const { dispatch, comicId } = this.props;
    dispatch(asyncDeleteComic(comicId));
  };

  render() {
    return (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item
              key="remove"
              className={styles.deleteButton}
              onClick={this.handleDeleteComic}
            >
              <Icon type="delete" />
              删除
            </Menu.Item>
          </Menu>
        }
        trigger={['contextMenu']}
      >
        {this.props.children}
      </Dropdown>
    );
  }
}

export default connect(mapStateToProps)(ContextMenu) as React.ComponentType<ContextMenuProps>;
