import { CreateBookshelfRequest, Bookshelf, BookshelfDetail } from 'vanaheim-shared';
import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('bookshelf');

export const asyncFetchBookshelf = actionCreator.async<void, Bookshelf[]>('asyncFetchBookshelf');

export const asyncCreateBookshelf = actionCreator.async<
  CreateBookshelfRequest & { callback(): void },
  Bookshelf
>('asyncCreateBookshelf');

export const asyncDeleteBookshelf = actionCreator.async<{ id: string }, void>(
  'asyncDeleteBookshelf'
);

export const asyncBookshelfAddComic = actionCreator<{ bookshelfId: string; comicId: string }>(
  'asyncBookshelfAddComic'
);

export const asyncFetchBookshelfDetail = actionCreator.async<
  { bookshelfId: string },
  BookshelfDetail
>('asyncFetchBookshelfDetail');

export const cleanBookshelfDetail = actionCreator('cleanBookshelfDetail');
