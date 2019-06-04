type NamespaceName =
  | 'rows'
  | 'reclass'
  | 'language'
  | 'parody'
  | 'character'
  | 'group'
  | 'artist'
  | 'male'
  | 'female'
  | 'misc';

type Sha1Value = string;

interface Signature {
  name: string;
  email: string;
  when: Date;
}
interface Commit {
  author: Signature;
  committer: Signature;
  sha: Sha1Value;
  message: string;
}

interface NamespaceInfo {
  count: number;
  namespace: NamespaceName;
  data: {
    [key: string]: {
      intro: string;
      links: string;
      name: string;
    };
  };
}
export interface Database {
  repo: string;
  head: Commit;
  version: number;
  data: NamespaceInfo[];
}
