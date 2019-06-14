import { request } from './index';
import {
  CreateBookshelfRequest,
  CreateBookshelfResponse,
  FetchBookshelfResponse,
} from 'vanaheim-shared';

export function createBookShelfRequest(data: CreateBookshelfRequest) {
  return request.post<CreateBookshelfResponse>('v1/bookshelves', { data });
}

export function fetchBookshelf() {
  return request.get<FetchBookshelfResponse>('v1/bookshelves');
}

export function deleteBookshelf(id: string) {
  return request.delete(`v1/bookshelves/${id}`);
}

export function bookshelfAddComic(bookshelfId: string, comicId: string) {
  return request.post(`v1/bookshelves/${bookshelfId}/comics`, {
    data: { comicId },
  });
}

export function fetchBookshelfDetail(bookshelfId: string) {
  return request.get(`v1/bookshelves/${bookshelfId}`);
}
