import React, { Component } from 'react';

import TagSelector from '@/components/TagSelector';
import StandardFormRow from '@/components/StandardFormRow';
import { FormComponentProps } from 'antd/es/form';
import { Card, Form, Row, Col } from 'antd';
import { UmiComponentProps, GlobalState } from '@/common/types';
import { connect } from 'dva';
import { asyncFetchTags, asyncGetComic, setList } from '@/actions/comic';
import { getTagName, tagInfoMap, Tag } from '@/common/database';
import { TagType } from 'vanaheim-shared';
import styles from './recent.scss';

const mapStateToProps = ({ comic, loading, workspace }: GlobalState) => ({
  comic,
  loading,
  workspace,
});
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & UmiComponentProps & FormComponentProps;
type PageState = {
  tags: TagType[];
};

class TagsPage extends Component<PageProps, PageState> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      tags: ['tags', 'artist', 'parody', 'group', 'character', 'reclass', 'workspaceId'],
    };
  }

  componentDidMount = () => {
    const tags = this.state.tags;
    const { dispatch } = this.props;
    tags.forEach(tag => {
      dispatch(asyncFetchTags.started({ type: tag }));
    });
    dispatch(
      asyncGetComic({
        offset: 0,
      })
    );
  };

  componentWillUnmount = () => {
    this.props.dispatch(setList([]));
  };

  renderTag = (tag: TagType, last: boolean) => {
    const {
      comic,
      workspace,
      form: { getFieldDecorator },
    } = this.props;
    const tagsCount = comic.tags[tag] || [];
    if (tagsCount.length === 0) {
      return null;
    }
    const tagInfo = tagInfoMap[tag];
    if (!tagInfo) {
      return null;
    }
    if (tag === 'workspaceId') {
      const workspaceMap = new Map<string, Tag>();
      workspace.list.forEach(w => {
        workspaceMap.set(w.id, {
          name: w.name,
          key: w.id,
        });
      });
      tagInfo.map = workspaceMap;
    }
    return (
      <StandardFormRow key={tag} title={tagInfo.label} block last={last}>
        {getFieldDecorator(tag)(
          <TagSelector expandable hideCheckAll>
            {tagsCount.slice(0, 200).map(o => (
              <TagSelector.Option key={o.id} value={o.id}>
                {`${getTagName(tagInfo.map, o.id)}(${o.count})`}
              </TagSelector.Option>
            ))}
          </TagSelector>
        )}
      </StandardFormRow>
    );
  };

  render() {
    const { tags } = this.state;
    const { comic } = this.props;
    return (
      <React.Fragment>
        <Card style={{ marginBottom: 24 }}>
          <Form>{tags.map((tag, index) => this.renderTag(tag, index === tags.length - 1))}</Form>
        </Card>
        <Card>
          <Row gutter={20} type="flex">
            {comic.list.map(o => (
              <Col key={o.id} xs={12} md={8} lg={6} xl={4}>
                <div
                  className={styles.cover}
                  style={{ backgroundImage: `url(/server-static/cover/${o.id})` }}
                />
                <p>{o.title}</p>
              </Col>
            ))}
          </Row>
        </Card>
      </React.Fragment>
    );
  }
}

const WarpForm = Form.create<PageProps>({
  onValuesChange({ dispatch }: PageProps, __, allValues) {
    dispatch(
      asyncGetComic({
        ...allValues,
        offset: 0,
      })
    );
  },
})(TagsPage);

export default connect(mapStateToProps)(WarpForm);
