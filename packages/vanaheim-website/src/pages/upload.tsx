import React from 'react';
import { Row, Col, Form, Input, Select, Button, Icon, message, Tabs, Rate, Spin } from 'antd';
import style from './index.scss';
import ComicImporter, { ComicFolder, ComicImage } from '@/components/comicImporter';
import { FormComponentProps } from 'antd/lib/form';
import { GlobalState, UmiComponentProps } from '@/common/types';
import { connect } from 'dva';
import { asyncListWorkspace } from '@/actions/workspace';
import { asyncUploadComic, asyncSearchComic } from '@/actions/upload';
import { AddComicFormInfo, ComicSite } from 'vanaheim-shared';
import TagSelect from '@/components/tagSelect';
import {
  tags,
  parodyTags,
  characterTags,
  reclassTags,
  groupTags,
  artistTags,
  languageTags,
} from '@/common/database';
import TagSelector from '@/components/DataSelector';
import { union } from 'lodash';

const { TabPane } = Tabs;
const { Search } = Input;

type UploadPageState = {
  comicFolder: ComicFolder | null;
  initData: Partial<AddComicFormInfo>;
  deleteImage: Set<string>;
  currentTab: ComicSite;
  searchQuery: string;
};

const mapStateToProps = ({ workspace, loading, upload }: GlobalState) => ({
  workspace,
  loading,
  upload,
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
      deleteImage: new Set<string>(),
      currentTab: ComicSite.EHentai,
      searchQuery: '',
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
          fileList: comicFolder.files
            .filter(o => !this.state.deleteImage.has(o.previewUrl))
            .map(o => o.file),
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

  handleDeleteImage = (image: ComicImage) => {
    const { deleteImage } = this.state;
    deleteImage.add(image.previewUrl);
    this.setState({
      deleteImage: new Set(deleteImage),
    });
    message.destroy();
    message.success(
      <span>
        删除成功
        <Button type="link" onClick={() => this.handleCancelDeleteImage(image)}>
          撤销
        </Button>
      </span>
    );
  };

  handleCancelDeleteImage(image: ComicImage) {
    const { deleteImage } = this.state;
    deleteImage.delete(image.previewUrl);
    this.setState({
      deleteImage: new Set(deleteImage),
    });
    message.destroy();
  }

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
    this.handleSetSearchQuery(titleOriginal);
    return {
      title,
      titleOriginal,
      group,
      artist: artist ? [artist] : [],
      parody: parody ? [parody] : [],
      workspaceId,
    };
  }

  renderForm = () => {
    const { comicFolder, initData } = this.state;
    if (!comicFolder) {
      return;
    }
    const { form, workspace, loading } = this.props;
    return (
      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
        <Form.Item label="标题">
          {form.getFieldDecorator('title', {
            initialValue: initData.title,
            rules: [{ required: true, message: '请输入标题' }],
          })(<Input placeholder="请输入标题" />)}
        </Form.Item>
        <Form.Item label="原文标题">
          {form.getFieldDecorator('titleOriginal', {
            initialValue: initData.titleOriginal,
          })(
            <Input
              placeholder="请输入原文标题"
              onChange={e => this.handleSetSearchQuery(e.target.value)}
            />
          )}
        </Form.Item>
        <Form.Item label="语言">
          {form.getFieldDecorator('language', { initialValue: initData.group })(
            <TagSelect tags={languageTags} />
          )}
        </Form.Item>
        <Form.Item label="团体">
          {form.getFieldDecorator('group', { initialValue: initData.group })(
            <TagSelect tags={groupTags} />
          )}
        </Form.Item>
        <Form.Item label="评分">{form.getFieldDecorator('rate')(<Rate allowHalf />)}</Form.Item>
        <Form.Item label="类型">
          {form.getFieldDecorator('reclass')(<TagSelect tags={reclassTags} />)}
        </Form.Item>
        <Form.Item label="角色">
          {form.getFieldDecorator('character')(<TagSelect multiple tags={characterTags} />)}
        </Form.Item>
        <Form.Item label="作者">
          {form.getFieldDecorator('artist', {
            initialValue: initData.artist,
            rules: [{ required: true, message: '请输入作者' }],
          })(<TagSelect multiple tags={artistTags} />)}
        </Form.Item>
        <Form.Item label="原作">
          {form.getFieldDecorator('parody', {
            initialValue: initData.parody,
          })(<TagSelect multiple tags={parodyTags} />)}
        </Form.Item>
        <Form.Item label="标签">
          {form.getFieldDecorator('tags')(<TagSelect multiple tags={tags} />)}
        </Form.Item>
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
    );
  };

  renderPreview = () => {
    const { comicFolder } = this.state;
    if (!comicFolder) {
      return;
    }
    const { files } = comicFolder;
    return files
      .filter(file => !this.state.deleteImage.has(file.previewUrl))
      .map((o, index) => (
        <Col key={index} xs={12} md={8} lg={6} xl={4}>
          <div className={style.cover} style={{ backgroundImage: `url(${o.previewUrl})` }}>
            <div className={style.previewItem}>
              <span>
                <Icon
                  className={style.previewItemActions}
                  type="picture"
                  onClick={() => this.handleSetCover(o)}
                  title="设为封面"
                />
                <Icon
                  onClick={() => this.handleDeleteImage(o)}
                  className={style.previewItemActions}
                  type="delete"
                  title="删除"
                />
              </span>
            </div>
          </div>
          <p>{o.file.name}</p>
        </Col>
      ));
  };

  handleSearchConfig = () => {
    this.props.dispatch(
      asyncSearchComic({
        keyword: this.state.searchQuery || this.props.form.getFieldValue('titleOriginal'),
        type: this.state.currentTab,
      })
    );
  };

  handleSetSearchQuery = (searchQuery: string) => {
    this.setState({
      searchQuery,
    });
  };

  renderSiteSearch = () => (
    <React.Fragment>
      <Search
        enterButton="搜索"
        value={this.state.searchQuery}
        onSearch={this.handleSearchConfig}
        disabled={this.props.loading.effects[asyncSearchComic.type]}
        onChange={e => this.handleSetSearchQuery(e.target.value)}
        style={{ marginBottom: 20 }}
      />
      <Tabs
        defaultActiveKey={this.state.currentTab}
        style={{ background: 'white', minHeight: 300, padding: 10 }}
      >
        <TabPane tab={<span>E-Hentai</span>} key={ComicSite.EHentai}>
          <Spin tip="Loading..." spinning={!!this.props.loading.effects[asyncSearchComic.type]}>
            <TagSelector
              data={this.props.upload.comicInfo[this.state.currentTab] || []}
              formValue={this.props.form.getFieldsValue()}
              onRemoveTag={key => {
                if (['reclass', 'group', 'titleOriginal', 'rate'].some(v => key === v)) {
                  this.props.form.resetFields([key]);
                  return;
                }
              }}
              onSelectTag={(key, tag) => {
                if (['parody', 'tags', 'artist', 'character', 'language'].some(v => key === v)) {
                  this.props.form.setFieldsValue({
                    [key]: union([tag], this.props.form.getFieldValue(key)),
                  });
                  return;
                }
                if (['reclass', 'group', 'titleOriginal', 'rate'].some(v => key === v)) {
                  this.props.form.setFieldsValue({
                    [key]: tag,
                  });
                  return;
                }
              }}
            />
          </Spin>
          ,
        </TabPane>
      </Tabs>
    </React.Fragment>
  );

  renderCover = () => {
    const { comicFolder } = this.state;
    if (!comicFolder) {
      return;
    }
    const { cover, dirname } = comicFolder;
    return (
      <React.Fragment>
        <div className={style.cover} style={{ backgroundImage: `url(${cover.previewUrl})` }} />
        <div>{dirname}</div>
      </React.Fragment>
    );
  };

  render() {
    const { comicFolder } = this.state;
    console.log(this.props.loading.effects[asyncSearchComic.type]);
    console.log(this.props.loading.effects[asyncSearchComic.type]);
    console.log(this.props.loading.effects[asyncSearchComic.type]);

    return (
      <div>
        {!comicFolder ? (
          <ComicImporter
            onSelect={this.handleSelect}
            className={style.fileSelect}
            pattern={['[作者]原文标题', '[团体(作者)]原文标题']}
          />
        ) : (
          <React.Fragment>
            <Row style={{ marginBottom: 20 }} gutter={20}>
              <Col span={8}>{this.renderCover()}</Col>
              <Col span={8}>{this.renderForm()}</Col>
              <Col span={8}>{this.renderSiteSearch()}</Col>
            </Row>
            <Row gutter={20}>{this.renderPreview()}</Row>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Form.create<FormComponentProps>()(connect(mapStateToProps)(UploadPage));
