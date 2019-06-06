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

function getTagData(namespaces: string[]) {
  const tagsData = database.data
    .filter(({ namespace }) => namespaces.some(o => o === namespace))
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
  return tagSet;
}

export const tagsSet = getTagData(['male', 'female', 'misc']);
export const tags = Array.from(tagsSet.values());

export const reclassTagsSet = getTagData(['reclass']);
export const reclassTags = Array.from(reclassTagsSet.values());

export const characterTagsTagsSet = getTagData(['character']);
export const characterTags = Array.from(characterTagsTagsSet.values());

export const parodyTagsTagsSet = getTagData(['parody']);
export const parodyTags = Array.from(parodyTagsTagsSet.values());

export const artistTagsTagsSet = getTagData(['artist']);
export const artistTags = Array.from(artistTagsTagsSet.values());

export const groupTagsTagsSet = getTagData(['group']);
export const groupTags = Array.from(groupTagsTagsSet.values());

export const languageTagsSet = getTagData(['language']);
export const languageTags = Array.from(languageTagsSet.values());
