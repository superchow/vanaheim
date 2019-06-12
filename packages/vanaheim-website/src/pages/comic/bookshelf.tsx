import React from 'react';
import { connect } from 'dva';
import { GlobalState, UmiComponentProps } from '@/common/types';
import { Card, Table } from 'antd';

const mapStateToProps = ({ loading }: GlobalState) => ({ loading });
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & UmiComponentProps;

type PageState = {};

class Workspace extends React.PureComponent<PageProps, PageState> {
  get renderTable() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '书架名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '数量',
        dataIndex: 'comicNumber',
        key: 'comicNumber',
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
      },
      {
        title: '修改时间',
        dataIndex: 'modifiedAt',
        key: 'modifiedAt',
      },
      {
        title: '操作',
        dataIndex: 'modifiedAt',
        key: 'modifiedAt',
      },
    ];
    return <Table columns={columns} />;
  }

  render() {
    return <Card>{this.renderTable}</Card>;
  }
}

export default connect(mapStateToProps)(Workspace);
