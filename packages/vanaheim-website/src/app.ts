import { Action } from 'dva-model-creator';

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      console.error(err.message);
    },
  },
  plugins: [
    require('dva-logger')({
      predicate: (_: Function, { type }: Action<any>) => {
        return (
          !type.endsWith('@@end') &&
          !type.endsWith('@@start') &&
          !type.startsWith('@@DVA_LOADING') &&
          !type.startsWith('@@router')
        );
      },
    }),
  ],
};
