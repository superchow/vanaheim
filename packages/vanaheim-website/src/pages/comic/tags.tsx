import React, { Component } from 'react';

import TagSelector from '@/components/TagSelector';
import StandardFormRow from '@/components/StandardFormRow';
import { FormComponentProps } from 'antd/es/form';
import { Card, Form, Row, Col } from 'antd';
import { UmiComponentProps, GlobalState } from '@/common/types';
import { connect } from 'dva';
import { asyncFetchTags, asyncGetComic, setList } from '@/actions/comic';
import { getTagName, tagInfoMap, Tag } from '@/common/database';
import { TagType, TagTypeArray } from 'vanaheim-shared';
import styles from './recent.scss';
import { History } from 'history';
import ContextMenu from './components/ContextMenu';

const mapStateToProps = ({ comic, loading, workspace }: GlobalState) => {
  return {
    comic,
    loading,
    workspace,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & UmiComponentProps & FormComponentProps;

function getTagsFromHistory(history: History): TagType[] {
  const { query = {} } = history.location as any;
  const tags: TagType | TagType[] = query.tags || TagTypeArray;
  if (Array.isArray(tags)) {
    return tags;
  }
  return [tags];
}

class TagsPage extends Component<PageProps> {
  componentDidMount = () => {
    const { dispatch, history, form } = this.props;
    dispatch(
      asyncFetchTags.started({
        tagTypes: getTagsFromHistory(history),
        selectTags: form.getFieldsValue(),
      })
    );
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
    const tagInfo = tagInfoMap[tag];
    if (!tagInfo || tagsCount.length === 0) {
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
            {tagsCount.map(o => (
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
    const { comic, history } = this.props;
    const tags: TagType[] = getTagsFromHistory(history);
    return (
      <React.Fragment>
        <Card style={{ marginBottom: 24 }}>
          <Form>{tags.map((tag, index) => this.renderTag(tag, index === tags.length - 1))}</Form>
        </Card>
        <Card>
          <Row gutter={20} type="flex">
            {comic.list.map(o => (
              <Col key={o.id} xs={12} md={8} lg={6} xl={4}>
                <ContextMenu comicId={o.id}>
                  <div
                    className={styles.cover}
                    style={{ backgroundImage: `url(/server-static/cover/${o.id})` }}
                  />
                </ContextMenu>
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
  onValuesChange({ dispatch, history }: PageProps, __, allValues) {
    dispatch(
      asyncGetComic({
        ...allValues,
        offset: 0,
      })
    );
    dispatch(
      asyncFetchTags.started({
        tagTypes: getTagsFromHistory(history),
        selectTags: allValues,
      })
    );
  },
})(TagsPage);

export default connect(mapStateToProps)(WarpForm);
