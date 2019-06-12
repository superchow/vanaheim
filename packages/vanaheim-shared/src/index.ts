export interface BaseResponse<T> {
  message?: string;
  data: T;
}

export * from './model/workspace';
export * from './model/bookShelf';
export * from './model/comic';
export * from './model/database';
export * from './model/site';
