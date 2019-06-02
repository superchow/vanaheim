import { ComicListNode } from './../../../vanaheim-shared/lib/model/comic.d';
import { GetComicRequestQuery } from 'vanaheim-shared';
import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('comic');

export const asyncGetComic = actionCreator<GetComicRequestQuery>('ASYNC_GET_COMIC');

export const setList = actionCreator<ComicListNode[]>('SET_LIST');
