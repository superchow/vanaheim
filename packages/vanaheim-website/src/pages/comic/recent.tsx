import React from 'react';
import { connect } from 'dva';
import { GlobalState, UmiComponentProps } from '@/common/types';
import { asyncGetComic } from '@/actions/comic';
import { Col, Row } from 'antd';
import styles from './recent.scss';

const mapStateToProps = ({ comic, loading }: GlobalState) => ({ comic, loading });
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & UmiComponentProps;
type PageState = {};

class RecentComic extends React.PureComponent<PageProps, PageState> {
  componentDidMount() {
    this.props.dispatch(
      asyncGetComic({
        offset: 0,
        pageSize: 0,
      })
    );
  }

  render() {
    const { list } = this.props.comic;
    return (
      <div style={{ background: 'white', padding: 24 }}>
        <Row gutter={20} type="flex">
          {list.map(o => (
            <Col key={o.id} xs={12} md={8} lg={6} xl={4}>
              <div
                className={styles.cover}
                style={{ backgroundImage: `url(/server-static/cover/${o.id})` }}
              />
              <p>{o.title}</p>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default connect(mapStateToProps)(RecentComic);
