export interface BaseResponse<T> {
  message?: string;
  data: T;
}

export * from './model/workspace';
export * from './model/parody';
export * from './model/comic';
