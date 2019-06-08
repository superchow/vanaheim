import { GetComicRequestQuery, ComicListNode, ComicTags } from 'vanaheim-shared';
import { actionCreatorFactory } from 'dva-model-creator';
import { GetComicTagsQuery } from 'vanaheim-shared/src';

const actionCreator = actionCreatorFactory('comic');

export const asyncGetComic = actionCreator<GetComicRequestQuery>('ASYNC_GET_COMIC');

export const setList = actionCreator<ComicListNode[]>('SET_LIST');

export const asyncFetchTags = actionCreator.async<GetComicTagsQuery, { tags: ComicTags[] }>(
  'ASYNC_FETCH_TAGS'
);

export const asyncDeleteComic = actionCreator<string>('asyncDeleteComic');
