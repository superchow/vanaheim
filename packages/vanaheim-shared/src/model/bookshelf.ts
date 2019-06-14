import { ComicListNode } from './comic';
import { BaseResponse } from './../index';
export interface Bookshelf {
  id: string;
  title: string;
  comicList: string[];
  createdAt: string;
  modifiedAt: string;
}

export interface CreateBookshelfRequest {
  title: string;
}

export type CreateBookshelfResponse = BaseResponse<Bookshelf>;

export type FetchBookshelfResponse = BaseResponse<Bookshelf[]>;

export interface BookshelfAddComicRequest {
  comicId: string;
}

export interface BookshelfDeleteComicRequest {
  comicId: string;
}

export type BookshelfDetail = Omit<Bookshelf, 'comicList'> & { comicList: ComicListNode[] };

export type FetchBookshelfDetailResponse = BaseResponse<BookshelfDetail>;
