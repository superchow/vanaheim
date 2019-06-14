import React, { FC } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { Dropdown, Menu, Icon, Modal } from 'antd';
import { UmiComponentProps, GlobalState } from '@/common/types';
import { connect } from 'dva';
import styles from './ContextMenu.scss';
import SubMenu from 'antd/lib/menu/SubMenu';
import { asyncBookshelfAddComic } from '@/actions/bookshelf';
import { asyncDeleteComic } from '@/actions/comic';

const confirm = Modal.confirm;

const mapStateToProps = ({ bookshelf: { list } }: GlobalState) => {
  return {
    bookshelfList: list,
  };
};
type ContextMenuProps = {
  comicId: string;
};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = ContextMenuProps & PageStateProps & UmiComponentProps & FormComponentProps;

export const ContextMenu: FC<PageProps> = ({ children, dispatch, comicId, bookshelfList }) => {
  function handleDeleteComic() {
    confirm({
      title: '删除漫画',
      content: '是否确认删除',
      onOk() {
        dispatch(asyncDeleteComic(comicId));
      },
    });
  }

  function handleAddToBookshelf(bookshelfId: string) {
    dispatch(asyncBookshelfAddComic({ bookshelfId, comicId }));
  }

  return (
    <Dropdown
      overlay={
        <Menu>
          {bookshelfList.length > 0 && (
            <SubMenu title="添加到书架">
              {bookshelfList.map(({ title, id }) => (
                <Menu.Item key={id} onClick={() => handleAddToBookshelf(id)}>
                  {title}
                </Menu.Item>
              ))}
            </SubMenu>
          )}
          <Menu.Item key="remove" className={styles.deleteButton} onClick={handleDeleteComic}>
            <Icon type="delete" />
            删除
          </Menu.Item>
        </Menu>
      }
      trigger={['contextMenu']}
    >
      {children}
    </Dropdown>
  );
};

export default connect(mapStateToProps)(ContextMenu) as React.ComponentType<ContextMenuProps>;
