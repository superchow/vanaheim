import React, { Component, RefObject } from 'react';
import { generateUuid } from 'vanaheim-shared/lib/common/uuid';

interface UploadProps {
  directory?: boolean;
  onchange?(files: FileList): void;
}

interface UploadState {
  uid: string;
}

export default class Upload extends Component<UploadProps, UploadState> {
  private fileInput: RefObject<HTMLInputElement>;

  constructor(props: UploadProps) {
    super(props);
    this.fileInput = React.createRef();
    this.state = {
      uid: generateUuid(),
    };
  }

  handleClickInput = () => {
    if (!this.fileInput.current) {
      return;
    }
    this.fileInput.current.click();
  };

  componentDidMount = () => {
    this.configInput();
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onchange } = this.props;
    if (onchange && e.target.files) {
      onchange(e.target.files);
    }
    this.reset();
  };

  reset = () => {
    this.setState(
      {
        uid: generateUuid(),
      },
      () => this.configInput()
    );
  };

  configInput = () => {
    if (!this.fileInput.current) {
      return;
    }
    if (this.props.directory) {
      this.fileInput.current.setAttribute('directory', 'true');
      this.fileInput.current.setAttribute('webkitdirectory', 'true');
    }
  };

  render() {
    return (
      <div role="button" onClick={this.handleClickInput}>
        <input
          type="file"
          key={this.state.uid}
          ref={this.fileInput}
          style={{ display: 'none' }}
          onChange={this.handleChange}
        />
        {this.props.children}
      </div>
    );
  }
}
