import { CreateBookshelfRequest, Bookshelf } from 'vanaheim-shared';
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
