import React, { useEffect } from 'react';
import { connect } from 'dva';
import { GlobalState, UmiComponentProps } from '@/common/types';
import { asyncGetComic, setList } from '@/actions/comic';
import { Col, Row } from 'antd';
import styles from './recent.scss';
import ContextMenu from './components/ContextMenu';

const mapStateToProps = ({ comic: { list } }: GlobalState) => ({ list });
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & UmiComponentProps;

const RecentComic: React.FC<PageProps> = ({ list, dispatch }: PageProps) => {
  useEffect(() => {
    dispatch(
      asyncGetComic({
        offset: 0,
      })
    );
    return function clean() {
      dispatch(setList([]));
    };
  }, []);

  return (
    <div style={{ background: 'white', padding: 24 }}>
      <Row gutter={20} type="flex">
        {list.map(o => (
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
    </div>
  );
};

export default connect(mapStateToProps)(React.memo(RecentComic));
