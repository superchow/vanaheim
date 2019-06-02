import React from 'react';
import { Row, Col, Form, Input, Select, Button } from 'antd';
import style from './index.scss';
import ComicImporter, { ComicFolder, ComicImage } from '@/components/comicImporter';
import { FormComponentProps } from 'antd/lib/form';
import { GlobalState, UmiComponentProps } from '@/common/types';
import { connect } from 'dva';
import { asyncListWorkspace } from '@/actions/workspace';
import { asyncUploadComic } from '@/actions/upload';

type UploadPageState = {
  comicFolder: ComicFolder | null;
};

interface PageOwnProps {}

const mapStateToProps = ({ workspace }: GlobalState) => ({
  workspace,
});
type PageStateProps = ReturnType<typeof mapStateToProps>;

type PageProps = PageStateProps & PageOwnProps & FormComponentProps & UmiComponentProps;

const TagMap: {
  [key: string]: string;
} = {
  原文标题: 'titleOriginal',
  标题: 'title',
  团体: 'group',
  作者: 'artist',
};

class UploadPage extends React.PureComponent<PageProps, UploadPageState> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      comicFolder: null,
    };
  }

  componentDidMount() {
    this.props.dispatch(asyncListWorkspace());
  }

  handleSelect = (comicFolder: ComicFolder | null) => {
    this.setState({
      comicFolder: comicFolder,
    });
  };

  handleUploadComic = () => {
    const { form } = this.props;
    const { comicFolder } = this.state;
    if (!comicFolder) {
      return;
    }
    form.validateFields(error => {
      if (error) {
        return;
      }
      this.props.dispatch(
        asyncUploadComic({
          info: form.getFieldsValue() as any,
          cover: comicFolder.cover.file,
          fileList: comicFolder.files.map(o => o.file),
        })
      );
    });
  };

  handleSetCover = (cover: ComicImage) => {
    const { comicFolder } = this.state;
    if (!comicFolder) {
      return;
    }
    this.setState({
      comicFolder: {
        ...comicFolder,
        cover,
      },
    });
  };

  renderComicFolder = () => {
    const { comicFolder } = this.state;
    if (!comicFolder) {
      return;
    }
    const { files, cover, dirname } = comicFolder;
    const { form, workspace } = this.props;

    const { titleInfo } = comicFolder;
    const initData: ComicFolder['titleInfo'] = {};
    for (const key in titleInfo) {
      if (titleInfo.hasOwnProperty(key) && TagMap[key]) {
        initData[TagMap[key]] = titleInfo[key];
      }
    }
    if (!initData.title && initData.titleOriginal) {
      initData.title = initData.titleOriginal;
    }
    return (
      <React.Fragment>
        <Row style={{ marginBottom: 20 }} gutter={20}>
          <Col span={6}>
            <div className={style.cover} style={{ backgroundImage: `url(${cover.previewUrl})` }} />
            <div>{dirname}</div>
          </Col>
          <Col span={8}>
            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
              <Form.Item label="原文标题">
                {form.getFieldDecorator('titleOriginal', {
                  initialValue: initData.titleOriginal,
                })(<Input placeholder="请输入原文标题" />)}
              </Form.Item>
              <Form.Item label="标题">
                {form.getFieldDecorator('title', {
                  initialValue: initData.title,
                })(<Input placeholder="请输入标题" />)}
              </Form.Item>
              <Form.Item label="团体">
                {form.getFieldDecorator('group', {
                  initialValue: initData.group,
                })(<Input placeholder="请输入团体" />)}
              </Form.Item>
              <Form.Item label="作者">
                {form.getFieldDecorator('artist', {
                  initialValue: initData.artist,
                })(
                  <Select
                    mode="tags"
                    placeholder="请输入作者"
                    dropdownMenuStyle={{ display: 'none' }}
                  />
                )}
              </Form.Item>
              <Form.Item label="原作">
                {form.getFieldDecorator('parody', {
                  initialValue: initData.parody,
                })(
                  <Select
                    mode="tags"
                    placeholder="请输入原作"
                    dropdownMenuStyle={{ display: 'none' }}
                  />
                )}
              </Form.Item>
              <Form.Item label="标签">
                {form.getFieldDecorator('tags')(
                  <Select
                    mode="tags"
                    placeholder="请输入标签"
                    dropdownMenuStyle={{ display: 'none' }}
                  />
                )}
              </Form.Item>
              <Form.Item label="仓库">
                {form.getFieldDecorator('workspaceId', {
                  rules: [{ required: true, message: '请选择仓库' }],
                })(
                  <Select placeholder="请选择仓库">
                    {workspace.list.map(w => (
                      <Select.Option value={w.id} key={w.id}>
                        {w.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 5, span: 19 }}>
                <Row gutter={20}>
                  <Col span={12}>
                    <Button type="primary" block onClick={this.handleUploadComic}>
                      导入
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button type="danger" block onClick={() => this.handleSelect(null)}>
                      取消导入
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row gutter={20}>
          {files.map((o, index) => (
            <Col key={index} xs={12} md={8} lg={6} xl={4} onClick={() => this.handleSetCover(o)}>
              <div className={style.cover} style={{ backgroundImage: `url(${o.previewUrl})` }} />
              <p>{o.file.name}</p>
            </Col>
          ))}
        </Row>
      </React.Fragment>
    );
  };

  render() {
    const { comicFolder } = this.state;
    return (
      <div>
        {!comicFolder && (
          <ComicImporter
            onSelect={this.handleSelect}
            className={style.fileSelect}
            pattern={['[作者]原文标题', '[团体(作者)]原文标题']}
          />
        )}
        {!!comicFolder && this.renderComicFolder()}
      </div>
    );
  }
}

export default Form.create<PageOwnProps & FormComponentProps>()(
  connect(mapStateToProps)(UploadPage)
);
