import React from 'react';
import { Form, Modal, Input, Tree } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { GlobalState, UmiComponentProps } from '@/common/types';
import { asyncListFile, setTreeData } from '@/actions/workspaceModal';
import { connect } from 'dva';
import { TreeNodeNormal } from 'antd/lib/tree-select/interface';
import { AntTreeNodeExpandedEvent } from 'antd/lib/tree';
import { formatMessage } from 'umi-plugin-locale';

const FormItem = Form.Item;

const mapStateToProps = ({ loading, workspaceModal }: GlobalState) => ({ workspaceModal, loading });
type PageStateProps = ReturnType<typeof mapStateToProps>;

type PageOwnProps = {
  handleAdd: (data: { name: string; path: string }) => void;
  handleModalVisible: Function;
};

type ModelProps = PageOwnProps & FormComponentProps & UmiComponentProps & PageStateProps;

const { TreeNode, DirectoryTree } = Tree;

function renderTreeData(treeData: TreeNodeNormal[]) {
  return treeData.map(({ title, key, children, isLeaf }) => (
    <TreeNode title={title} key={key} isLeaf={isLeaf} selectable={isLeaf}>
      {children && renderTreeData(children)}
    </TreeNode>
  ));
}

class CreateForm extends React.PureComponent<ModelProps> {
  componentDidMount() {
    this.props.dispatch(asyncListFile('/Users/'));
  }

  okHandle = () => {
    const { handleAdd } = this.props;
    this.props.form.validateFields((err, fieldsValue: { name: string; path: string[] }) => {
      if (err) return;
      const { name, path } = fieldsValue;
      handleAdd({
        name,
        path: path[0],
      });
    });
  };

  handleExpand = (_: string[], info: AntTreeNodeExpandedEvent) => {
    if (info.expanded) {
      this.props.dispatch(asyncListFile(info.node.props.eventKey!));
    }
  };

  componentWillUnmount = () => {
    this.props.dispatch(setTreeData([]));
  };

  render() {
    const {
      form,
      handleModalVisible,
      workspaceModal: { treeData },
    } = this.props;

    return (
      <Modal
        destroyOnClose
        title={formatMessage({ id: 'Add Workspace' })}
        visible
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
          <FormItem label="路径">
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入名字！' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="名字">
            {form.getFieldDecorator('path', {
              trigger: 'onSelect',
              valuePropName: 'selectedKeys',
              rules: [{ required: true, message: '请选择空文件夹' }],
            })(
              <DirectoryTree
                style={{ maxHeight: 200, overflowY: 'scroll' }}
                onExpand={this.handleExpand}
              >
                {renderTreeData(treeData)}
              </DirectoryTree>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<PageOwnProps & FormComponentProps>()(
  connect(mapStateToProps)(CreateForm)
);
