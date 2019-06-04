import React from 'react';
import { Row, Col, Form, Input, Select, Button } from 'antd';
import style from './index.scss';
import ComicImporter, { ComicFolder, ComicImage } from '@/components/comicImporter';
import { FormComponentProps } from 'antd/lib/form';
import { GlobalState, UmiComponentProps } from '@/common/types';
import { connect } from 'dva';
import { asyncListWorkspace } from '@/actions/workspace';
import { asyncUploadComic } from '@/actions/upload';
import { AddComicFormInfo } from 'vanaheim-shared';
import TagSelect from '@/components/tagSelect';

type UploadPageState = {
  comicFolder: ComicFolder | null;
  initData: Partial<AddComicFormInfo>;
};

const mapStateToProps = ({ workspace, loading }: GlobalState) => ({
  workspace,
  loading,
});
type PageStateProps = ReturnType<typeof mapStateToProps>;

type PageProps = PageStateProps & FormComponentProps & UmiComponentProps;

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
      initData: {},
    };
  }

  componentDidMount() {
    this.props.dispatch(asyncListWorkspace());
  }

  handleSelect = (comicFolder: ComicFolder | null) => {
    let initData = {};
    if (comicFolder) {
      initData = this.getInitData(comicFolder.titleInfo);
    }
    this.setState({
      comicFolder: comicFolder,
      initData,
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
          callback: () => this.handleSelect(null),
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

  getInitData(titleInfo: ComicFolder['titleInfo']): Partial<AddComicFormInfo> {
    const { workspace } = this.props;
    const foo: ComicFolder['titleInfo'] = {};
    for (const key in titleInfo) {
      if (titleInfo.hasOwnProperty(key) && TagMap[key]) {
        foo[TagMap[key]] = titleInfo[key];
      }
    }
    let { group, title, titleOriginal, parody, artist } = foo;
    if (titleOriginal && !title) {
      title = titleOriginal;
    }
    let workspaceId;
    if (workspace.list.length > 0) {
      workspaceId = workspace.list[0].id;
    }
    return {
      title,
      titleOriginal,
      group,
      artist: artist ? [artist] : [],
      parody: parody ? [parody] : [],
      workspaceId,
    };
  }

  renderComicFolder = () => {
    const { comicFolder, initData } = this.state;
    if (!comicFolder) {
      return;
    }
    const { files, cover, dirname } = comicFolder;
    const { form, workspace, loading } = this.props;

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
                  rules: [{ required: true, message: '请输入标题' }],
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
                  rules: [{ required: true, message: '请输入作者' }],
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
              <Form.Item label="标签">{form.getFieldDecorator('tags')(<TagSelect />)}</Form.Item>
              <Form.Item label="仓库">
                {form.getFieldDecorator('workspaceId', {
                  initialValue: initData.workspaceId,
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
                    <Button
                      type="primary"
                      block
                      onClick={this.handleUploadComic}
                      loading={loading.effects[asyncUploadComic.type]}
                    >
                      导入
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      disabled={loading.effects[asyncUploadComic.type]}
                      type="danger"
                      block
                      onClick={() => this.handleSelect(null)}
                    >
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

export default Form.create<FormComponentProps>()(connect(mapStateToProps)(UploadPage));
