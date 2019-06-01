export interface Parody {
  id: string;
  title: string;
  titleOriginal: string;
  coverUrl: string;
  reference: ParodyReference;
  referenceUrl: string;
}

export type ParodyReference = 'bangumi';
