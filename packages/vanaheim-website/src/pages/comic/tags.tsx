import React, { Component } from 'react';

import TagSelector from '@/components/TagSelector';
import StandardFormRow from '@/components/StandardFormRow';
import { FormComponentProps } from 'antd/es/form';
import { Card } from 'antd';
import { UmiComponentProps, GlobalState } from '@/common/types';
import { connect } from 'dva';
import { asyncFetchTags } from '@/actions/comic';
import { getTagName, tagInfoMap, Tag } from '@/common/database';
import { TagType } from 'vanaheim-shared';

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
    tags.forEach(tag => {
      this.props.dispatch(asyncFetchTags.started({ type: tag }));
    });
  };

  render() {
    const { comic, workspace } = this.props;
    const { tags } = this.state;

    return (
      <Card>
        {tags.map(tag => {
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
            <StandardFormRow key={tag} title={tagInfo.label} block>
              <TagSelector expandable hideCheckAll>
                {tagsCount.map(o => (
                  <TagSelector.Option key={o.id} value={o.id}>
                    {`${getTagName(tagInfo.map, o.id)}(${o.count})`}
                  </TagSelector.Option>
                ))}
              </TagSelector>
            </StandardFormRow>
          );
        })}
      </Card>
    );
  }
}

export default connect(mapStateToProps)(TagsPage);
