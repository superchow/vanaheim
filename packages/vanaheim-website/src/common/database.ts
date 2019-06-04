import { Database } from 'vanaheim-shared';
import db from 'vanaheim-shared/data/db.raw.json';

export interface Tag {
  key: string;
  name: string;
  intro: string;
  links: string;
}

const database: Database = db;

export let latestVersion = database.head.committer.when;

export const tagsData = database.data
  .filter(({ namespace }) => namespace === 'male' || namespace === 'female' || namespace === 'misc')
  .map(o => o.data);

const tagSet = new Map<string, Tag>();

tagsData.forEach(data => {
  const keys = Object.keys(data);
  keys.forEach(key => {
    const tagValue = data[key];
    tagValue.name = tagValue.name.replace(/!\[.*\]\(.*\)/, '');
    tagSet.set(key, {
      ...tagValue,
      key,
    });
  });
});

export const tags = Array.from(tagSet.values());
