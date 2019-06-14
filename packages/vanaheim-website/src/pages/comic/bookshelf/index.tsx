import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { GlobalState, UmiComponentProps } from '@/common/types';
import { Card, Table, Button, Icon, Modal, Form, Input, Popconfirm } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import {
  asyncCreateBookshelf,
  asyncFetchBookshelf,
  asyncDeleteBookshelf,
} from '@/actions/bookshelf';
import dayjs from 'dayjs';

const mapStateToProps = ({ bookshelf }: GlobalState) => ({ bookshelf });
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & UmiComponentProps & FormComponentProps;

export const Bookshelf: React.FC<PageProps> = (props: PageProps) => {
  useEffect(() => {
    props.dispatch(asyncFetchBookshelf.started());
  }, []);
  const [showModal, setShowModel] = useState(false);

  function bookshelfTable() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '书架名',
        dataIndex: 'title',
      },
      {
        title: '数量',
        dataIndex: 'comicList',
        render(comicList: string[]) {
          return comicList.length;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        render(date: string) {
          return dayjs(date).format('YYYY-MM-DD');
        },
      },
      {
        title: '修改时间',
        dataIndex: 'modifiedAt',
        render(date: string) {
          return dayjs(date).format('YYYY-MM-DD');
        },
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'operation',
        render(id: string) {
          return (
            <Popconfirm
              title={'是否删除书架'}
              okText="Yes"
              cancelText="No"
              onConfirm={() => props.dispatch(asyncDeleteBookshelf.started({ id }))}
            >
              <Button type="danger">删除</Button>
            </Popconfirm>
          );
        },
      },
    ];
    return (
      <Table columns={columns} dataSource={props.bookshelf.list} pagination={false} rowKey="id" />
    );
  }

  function shelfModal() {
    const { form, dispatch } = props;

    const handleOk = () => {
      form.validateFields(err => {
        if (err) {
          return;
        }
        const title = form.getFieldValue('title');
        dispatch(
          asyncCreateBookshelf.started({
            title,
            callback: () => setShowModel(false),
          })
        );
      });
    };

    return (
      <React.Fragment>
        <Modal
          visible={showModal}
          title="新建书架"
          onOk={handleOk}
          onCancel={() => setShowModel(false)}
          destroyOnClose
        >
          <Form>
            <Form.Item label="书架名">
              {form.getFieldDecorator('title', {
                rules: [{ required: true }],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
        <Button style={{ marginBottom: 10 }} type="primary" onClick={() => setShowModel(true)}>
          <Icon type="plus" />
          新建书架
        </Button>
      </React.Fragment>
    );
  }

  return (
    <Card>
      {shelfModal()}
      {bookshelfTable()}
    </Card>
  );
};

const WarpForm = Form.create<PageProps>()(Bookshelf);

export default connect(mapStateToProps)(WarpForm);
