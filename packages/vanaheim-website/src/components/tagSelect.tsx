import { Select } from 'antd';
import React from 'react';
import { tags, Tag } from '@/common/database';
import { debounce } from 'lodash';

interface State {
  stateTags?: Tag[];
}

interface Props {
  value?: string;
  onChange?: (e: string) => any;
}

export default class TagSelect extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {};
    this.searchTag = debounce(this.searchTag, 300);
  }

  handleChange = (e: string) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(e);
    }
  };

  searchTag = async (value: string) => {
    const lowValue = value.toLowerCase();
    this.setState({
      stateTags: tags.filter(({ key, name }) => key.includes(lowValue) || name.includes(lowValue)),
    });
  };

  handleSearch = (value: string) => {
    if (!value) {
      this.setState({
        stateTags: tags,
      });
      return;
    }
    this.searchTag(value);
  };

  render() {
    const renderList = this.state.stateTags ? this.state.stateTags : tags;
    return (
      <Select
        onSearch={e => this.handleSearch(e)}
        value={this.props.value}
        mode="tags"
        placeholder="请输入标签"
        onChange={this.handleChange}
        filterOption={false}
        showSearch
      >
        {renderList
          .map((tag, index) => {
            if (this.props.value) {
              if (this.props.value.includes(tag.key)) {
                return <Select.Option key={tag.key}>{tag.name}</Select.Option>;
              }
            }
            if (index < 50) {
              return <Select.Option key={tag.key}>{tag.name}</Select.Option>;
            }
            return null;
          })
          .filter(o => !!o)}
      </Select>
    );
  }
}
