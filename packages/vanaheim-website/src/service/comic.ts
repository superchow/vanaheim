import { AddComicFormInfo, GetComicRequestQuery } from 'vanaheim-shared';
import { request } from './index';
import { stringify } from 'qs';

export function addComic(data: AddComicFormInfo, cover: File, fileList: File[]) {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('titleOriginal', data.titleOriginal);
  formData.append('group', data.group);
  formData.append('parody', JSON.stringify(data.parody));
  formData.append('artist', JSON.stringify(data.artist));
  formData.append('tags', JSON.stringify(data.tags));
  formData.append('workspaceId', data.workspaceId);
  formData.append('cover', cover);
  fileList.forEach((file, index) => {
    formData.append(`file_${index}`, file, file.name);
  });
  request.post('v1/comic/add', {
    data: formData,
    requestType: 'form',
  });
}

export function getComic(query: GetComicRequestQuery) {
  return request.get(`v1/comic?${stringify(query)}`);
}
