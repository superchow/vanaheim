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

export interface AddComicRequest {
  comicId: string;
}

export interface DeleteComicRequest {
  comicId: string;
}
