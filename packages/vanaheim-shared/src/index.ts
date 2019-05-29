export interface BaseResponse<T> {
  message?: string;
  data: T;
}

export * from './model/workspace';
