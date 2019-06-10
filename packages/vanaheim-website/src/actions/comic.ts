import {
  GetComicRequestQuery,
  ComicListNode,
  GetComicTagsResponse,
  GetComicTagsQuery,
} from 'vanaheim-shared';
import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('comic');

export const asyncGetComic = actionCreator<GetComicRequestQuery>('ASYNC_GET_COMIC');

export const setList = actionCreator<ComicListNode[]>('SET_LIST');

export const asyncFetchTags = actionCreator.async<GetComicTagsQuery, GetComicTagsResponse>(
  'ASYNC_FETCH_TAGS'
);

export const asyncDeleteComic = actionCreator<string>('asyncDeleteComic');
