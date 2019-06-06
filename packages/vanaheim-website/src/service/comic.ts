import { SearchComicRawInfoRequest } from 'vanaheim-shared/src';
import { AddComicFormInfo, GetComicRequestQuery } from 'vanaheim-shared';
import { request } from './index';
import { stringify } from 'qs';
import { isUndefined } from 'util';

export function addComic(data: AddComicFormInfo, cover: File, fileList: File[]) {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('titleOriginal', data.titleOriginal);
  formData.append('group', data.group);
  const { artist, tags, parody, reclass, workspaceId, character, rate } = data;
  if (parody && parody.length > 0) {
    formData.append('parody', JSON.stringify(parody));
  }
  if (artist && artist.length > 0) {
    formData.append('artist', JSON.stringify(artist));
  }
  if (tags && tags.length > 0) {
    formData.append('tags', JSON.stringify(tags));
  }
  if (tags && tags.length > 0) {
    formData.append('tags', JSON.stringify(tags));
  }
  if (reclass) {
    formData.append('reclass', reclass);
  }
  if (cover) {
    formData.append('cover', cover);
  }
  if (!isUndefined(rate)) {
    formData.append('rate', rate.toString());
  }
  if (character && character.length > 0) {
    formData.append('character', JSON.stringify(character));
  }
  if (workspaceId) {
    formData.append('workspaceId', workspaceId);
  }
  fileList.forEach((file, index) => {
    formData.append(`file_${index}`, file, file.name);
  });
  return request.post('v1/comic/add', {
    data: formData,
    requestType: 'form',
  });
}

export function getComic(query: GetComicRequestQuery) {
  return request.get(`v1/comic?${stringify(query)}`);
}

export function searchComicRawInfo(query: SearchComicRawInfoRequest) {
  return request.get(`v1/crawler?${stringify(query)}`);
}
