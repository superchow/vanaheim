import { Database } from 'vanaheim-shared';
import db from 'vanaheim-shared/data/db.raw.json';

export interface Tag {
  key: string;
  name: string;
  intro?: string;
  links?: string;
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

export const getTagName = (map: Map<string, Tag>, key: string) => {
  const tag = map.get(key);
  if (tag) {
    return tag.name;
  }
  return key;
};

export const tagInfoMap: {
  [key: string]: { label: string; map: any };
} = {
  group: { label: '团体', map: groupTagsTagsSet },
  tags: { label: '标签', map: tagsSet },
  artist: { label: '画师', map: artistTagsTagsSet },
  parody: { label: '原著', map: parodyTagsTagsSet },
  character: { label: '角色', map: characterTagsTagsSet },
  reclass: { label: '类别', map: reclassTagsSet },
  workspaceId: { label: '仓库', map: reclassTagsSet },
};
