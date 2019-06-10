import React from 'react';
import { Tag, Divider, Row, Col } from 'antd';
import { ComicRawInfo } from 'vanaheim-shared';
import {
  languageTagsSet,
  Tag as TagInfo,
  tagsSet,
  groupTagsTagsSet,
  artistTagsTagsSet,
  reclassTagsSet,
  characterTagsTagsSet,
  parodyTagsTagsSet,
} from '@/common/database';
import { union } from 'lodash';

interface Props {
  data: ComicRawInfo[];
  formValue: any;
  onSelectTag(key: string, tag: string): void;
  onRemoveTag(key: string, tag: string): void;
}

const tagList = [
  {
    key: 'titleOriginal',
    label: '标题',
  },
  {
    key: 'reclass',
    label: '类别',
    set: reclassTagsSet,
  },
  {
    key: 'character',
    label: '角色',
    set: characterTagsTagsSet,
  },
  {
    key: 'parody',
    label: '原著',
    set: parodyTagsTagsSet,
  },
  {
    key: 'rate',
    label: '评分',
  },
  {
    key: 'artist',
    label: '艺术家',
    set: artistTagsTagsSet,
  },
  {
    key: 'group',
    label: '团体',
    set: groupTagsTagsSet,
  },
  {
    key: 'language',
    label: '语言',
    set: languageTagsSet,
  },
  {
    key: 'tags',
    label: '标签',
    set: tagsSet,
  },
];

const CheckableTag = Tag.CheckableTag;

export default class DataSelector extends React.Component<Props> {
  renderTagLabel(key: string, map?: Map<string, TagInfo>) {
    if (!map) {
      return key;
    }
    const data = map.get(key);
    if (!data) {
      return key;
    }
    return data.name;
  }

  handleClickAllTags = (key: string, tags: string[]) => {
    tags.forEach(tag => {
      this.props.onSelectTag(key, tag);
    });
  };

  handleClickTags = (key: string, tag: string) => {
    if (!this.getCheckStatus(key, tag)) {
      this.props.onSelectTag(key, tag);
    } else {
      this.props.onRemoveTag(key, tag);
    }
  };

  getCheckStatus = (key: string, tag: string): boolean => {
    const value = this.props.formValue[key];
    if (Array.isArray(value)) {
      return value.includes(tag);
    }
    return value === tag;
  };

  renderTree = (data: Partial<ComicRawInfo>, index: number) => {
    return (
      <div key={index}>
        <Row>
          <Col span={5}>
            <img src={data.cover} style={{ maxWidth: '100%' }} />
          </Col>
          <Col span={18} push={1}>
            {tagList.map(({ key, set, label }) => {
              let tags = (data as any)[key] as string | string[];
              if (!tags) {
                return null;
              }
              tags = Array.isArray(tags) ? tags : [tags];
              if (tags.length === 0) {
                return null;
              }
              return (
                <div key={key}>
                  <h6
                    style={{ marginRight: 8, display: 'inline' }}
                    onClick={() => this.handleClickAllTags(key, tags as string[])}
                  >
                    {label}:
                  </h6>
                  {union(tags).map(o => (
                    <CheckableTag
                      checked={this.getCheckStatus(key, o)}
                      key={o}
                      onChange={() => this.handleClickTags(key, o)}
                    >
                      {this.renderTagLabel(o, set)}
                    </CheckableTag>
                  ))}
                </div>
              );
            })}
          </Col>
        </Row>
        <Divider />
      </div>
    );
  };

  render() {
    const { data } = this.props;
    return <div>{data.map(this.renderTree)}</div>;
  }
}
