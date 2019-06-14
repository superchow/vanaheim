import React, { useEffect } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { GlobalState, UmiComponentProps } from '@/common/types';
import { FormComponentProps } from 'antd/es/form';
import { asyncFetchBookshelfDetail, cleanBookshelfDetail } from '@/actions/bookshelf';
import { Card, Row, Col } from 'antd';
import styles from '../recent.scss';

const mapStateToProps = ({ bookshelf }: GlobalState) => ({ bookshelf });
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & UmiComponentProps & FormComponentProps;

const page: React.FC<PageProps> = ({ history, dispatch, bookshelf: { detail } }) => {
  const match = routerRedux.createMatchSelector('/comic/bookshelf/:id')({
    router: { location: history.location },
  });
  if (!match) {
    return <div />;
  }
  const { id } = match.params as any;
  useEffect(() => {
    dispatch(asyncFetchBookshelfDetail.started({ bookshelfId: id }));
    return function clean() {
      dispatch(cleanBookshelfDetail());
    };
  }, []);
  if (!detail) {
    return <div />;
  }

  return (
    <Card title={detail.title}>
      <Row gutter={20} type="flex">
        {detail.comicList.map(o => (
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
  );
};

export default connect(mapStateToProps)(page);
