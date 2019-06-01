import React from 'react';
import { Icon, Button, Radio, Row, Col, Form, Input } from 'antd';
import Dropzone, { DropzoneState } from 'react-dropzone';
import style from './index.scss';
import Upload from '@/components/upload';
import { RadioChangeEvent } from 'antd/lib/radio';
import { parseTitle } from 'vanaheim-shared/lib/common/title';

export interface ComicFolder {
  dirname: string;
  files: ComicImage[];
  titleInfo: {
    [key: string]: string;
  };
}

export interface ComicImage {
  previewUrl: string;
  file: File;
}

interface DropZonFile extends File {
  path: string;
}

export interface FileSelectProps {
  pattern: string[];
  className?: string;
  onSelect(comicFolder: ComicFolder): void;
}

export interface ComicImporterState {
  patternIndex: number;
  costumePattern: string;
}

export default class ComicImporter extends React.PureComponent<
  FileSelectProps,
  ComicImporterState
> {
  constructor(props: FileSelectProps) {
    super(props);
    this.state = {
      patternIndex: 0,
      costumePattern: '',
    };
  }

  handleSelectDirectory = async (fileList: FileList) => {
    if (fileList.length === 0) {
      return false;
    }
    let dirname = '';
    const firstLayer = Array.from(fileList).map(
      (file): ComicImage | null => {
        let pathArray = (file as any).webkitRelativePath.split('/');
        if (pathArray.length !== 2 || !/\.(jpg|jpeg|png)$/i.test(pathArray[1])) {
          return null;
        }
        dirname = pathArray[0];
        return {
          file: file,
          previewUrl: URL.createObjectURL(file),
        };
      }
    );
    this.handleSelect(firstLayer, dirname);
    return false;
  };

  handleDropDown = (fileList: DropZonFile[]) => {
    if (fileList.length === 0) {
      return;
    }
    let dirname = '';
    const firstLayer = fileList.map(
      (file): ComicImage | null => {
        let pathArray = file.path.split('/').filter(o => !!o);
        if (pathArray.length !== 2 || !/\.(jpg|jpeg|png)$/i.test(pathArray[1])) {
          return null;
        }
        dirname = pathArray[0];
        return {
          file: file,
          previewUrl: URL.createObjectURL(file),
        };
      }
    );
    this.handleSelect(firstLayer, dirname);
  };

  handleSelect = (files: Array<ComicImage | null>, dirname: string) => {
    const sortedFile = files
      .filter((o): o is ComicImage => !!o)
      .sort((a, b) => a.file.name.localeCompare(b.file.name));

    const pattern = this.props.pattern[this.state.patternIndex] || this.state.costumePattern;

    this.props.onSelect({
      dirname,
      files: sortedFile,
      titleInfo: parseTitle(dirname, pattern),
    });
  };

  handleChangePatternIndex = (event: RadioChangeEvent) => {
    this.setState({
      patternIndex: event.target.value,
    });
  };

  handleCostumePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      costumePattern: e.target.value,
    });
  };

  render() {
    const { pattern } = this.props;

    return (
      <div className={this.props.className}>
        <Row>
          <Col span={12}>
            <Form.Item label="模板">
              <Radio.Group value={this.state.patternIndex} onChange={this.handleChangePatternIndex}>
                {pattern.map((p, index) => (
                  <Radio key={p} value={index}>
                    {p}
                  </Radio>
                ))}
                <Radio value={pattern.length}>
                  <Input onChange={this.handleCostumePatternChange} />
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Upload directory onchange={this.handleSelectDirectory}>
              <Button type="primary" className={style.upload}>
                <Icon type="upload" /> 请选择文件夹
              </Button>
            </Upload>
          </Col>
        </Row>
        <Dropzone onDrop={this.handleDropDown} noClick>
          {({
            getRootProps,
            getInputProps,
          }: {
            getRootProps: DropzoneState['getRootProps'];
            getInputProps: DropzoneState['getInputProps'];
          }) => (
            <div {...getRootProps()} className={style.dropzone}>
              <input {...getInputProps() as any} />
              <p>请拖入文件夹</p>
            </div>
          )}
        </Dropzone>
      </div>
    );
  }
}
