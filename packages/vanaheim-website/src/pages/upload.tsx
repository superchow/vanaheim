import React from 'react';
import { Row, Col } from 'antd';
import style from './index.scss';
import ComicImporter, { ComicImage, ComicFolder } from '@/components/comicImporter';

interface UploadPageState {
  dirname: string;
  files: ComicImage[];
}

export default class UploadPage extends React.PureComponent<any, UploadPageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      dirname: '',
      files: [],
    };
  }

  handleSelect = (comicFolder: ComicFolder) => {
    console.log(comicFolder);
    this.setState({
      ...comicFolder,
    });
  };

  render() {
    const { files, dirname } = this.state;
    return (
      <div>
        {files.length === 0 && (
          <ComicImporter
            onSelect={this.handleSelect}
            className={style.fileSelect}
            pattern={['[作者]原文标题']}
          />
        )}
        <div>{dirname}</div>

        <Row gutter={20}>
          {files.map((o, index) => (
            <Col key={index} xs={12} md={8} lg={6} xl={4}>
              <div className={style.cover} style={{ backgroundImage: `url(${o.previewUrl})` }} />
              <p>{o.file.name}</p>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}
