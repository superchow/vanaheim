import React from 'react';
import { connect } from 'dva';
import { GlobalState, UmiComponentProps } from '@/common/types';
import { asyncListWorkspace, asyncDeleteWorkspace, asyncAddWorkspace } from '@/actions/workspace';
import { Table, Button, Icon, Badge } from 'antd';
import WorkspaceModel from './components/workspaceModal';
import { AddWorkspaceRequest } from 'vanaheim-shared';
import dayjs from 'dayjs';

const mapStateToProps = ({ workspace, loading }: GlobalState) => ({ workspace, loading });
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & UmiComponentProps;

type PageState = {
  workspaceModelVisible: boolean;
};

class Workspace extends React.PureComponent<PageProps, PageState> {
  state = {
    workspaceModelVisible: false,
  };

  componentDidMount() {
    this.props.dispatch(asyncListWorkspace());
  }

  handleDeleteWorkspace = (id: string) => {
    this.props.dispatch(asyncDeleteWorkspace({ id }));
  };

  handleToggleWorkspaceModel = () => {
    this.setState({
      workspaceModelVisible: !this.state.workspaceModelVisible,
    });
  };

  handleAddWorkspace = ({ name, path }: AddWorkspaceRequest) => {
    this.props.dispatch(
      asyncAddWorkspace({
        name,
        path,
        callback: () => this.handleToggleWorkspaceModel(),
      })
    );
  };

  renderTable = () => {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '名字',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '路径',
        dataIndex: 'path',
        key: 'path',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (data: string) =>
          data ? <Badge status="success" text="正常" /> : <Badge status="error" text="异常" />,
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (data: string) => dayjs(data).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'id',
        render: (id: string) => (
          <Button onClick={() => this.handleDeleteWorkspace(id)} type="danger">
            删除
          </Button>
        ),
      },
    ];

    const { loading } = this.props;

    return (
      <Table
        rowKey="id"
        loading={loading.effects[asyncListWorkspace.type]}
        pagination={false}
        columns={columns}
        dataSource={this.props.workspace.list}
      />
    );
  };

  render() {
    const { workspaceModelVisible } = this.state;

    return (
      <div style={{ background: 'white', padding: 20 }}>
        <Button
          type="primary"
          style={{ marginBottom: 20 }}
          onClick={this.handleToggleWorkspaceModel}
        >
          <Icon type="plus" /> 新建
        </Button>
        {workspaceModelVisible && (
          <WorkspaceModel
            handleModalVisible={this.handleToggleWorkspaceModel}
            handleAdd={this.handleAddWorkspace}
          />
        )}
        {this.renderTable()}
      </div>
    );
  }
}

export default connect(mapStateToProps)(Workspace);
