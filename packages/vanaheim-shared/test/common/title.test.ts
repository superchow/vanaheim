import { parsePattern, Pattern, parseTitle } from '../../src/common/title';
import * as assert from 'assert';

describe('test parsePattern', () => {
  it('should get empty content', () => {
    const result = parsePattern('[]');
    const expectData: Pattern[] = [{ char: '[', content: '' }];
    assert.deepEqual(result, expectData);
  });

  it('should trim content', () => {
    const result = parsePattern('[   ]');
    const expectData: Pattern[] = [{ char: '[', content: '' }];
    assert.deepEqual(result, expectData);
  });

  it('should get data not in bracket', () => {
    const result = parsePattern('[ author ] title   ');
    const expectData: Pattern[] = [{ char: '[', content: 'author' }, { content: 'title' }];
    assert.deepEqual(result, expectData);
  });
  it('should support nested parentheses', () => {
    const result = parsePattern('[group (author[age])] title ');
    const expectData: Pattern[] = [
      {
        char: '[',
        content: [
          { content: 'group' },
          { char: '(', content: [{ content: 'author' }, { char: '[', content: 'age' }] },
        ],
      },
      { content: 'title' },
    ];
    assert.deepEqual(result, expectData);
  });
});

describe('test parseTitle', () => {
  it('should work correct', () => {
    const pattern = '(year)[group (author)] title';

    assert.deepEqual(
      { year: 'year', group: 'group', title: 'title' },
      parseTitle('(year)[group ] title', pattern)
    );

    assert.deepEqual({ group: 'group', title: 'title' }, parseTitle('[group] title', pattern));

    assert.deepEqual({ year: 'year', title: 'title' }, parseTitle('(year) title ', pattern));

    assert.deepEqual(
      { year: 'year', title: 'title', author: 'author' },
      parseTitle('(year)[       (author)] title ', pattern)
    );

    assert.deepEqual(
      { year: 'year', title: 'title', author: 'author', group: 'group' },
      parseTitle('(year)[group (author)] title ', pattern)
    );

    assert.deepEqual(
      { title: 'ハナとテツロウ', group: 'ユースケ' },
      parseTitle('[ユースケ]ハナとテツロウ（Sample）', pattern)
    );

    assert.deepEqual(
      { 原文标题: 'ハナとテツロウ', 作者: 'ユースケ' },
      parseTitle('[ユースケ]ハナとテツロウ（Sample）', '[作者]原文标题')
    );
  });
});
