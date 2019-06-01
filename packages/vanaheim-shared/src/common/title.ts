const leftBrackets = '[{(';
const rightBrackets = ']})';
const brackets = '[{(]})';

export interface Pattern {
  char?: string;
  content: string | Pattern[];
}

function isLeftBrackets(char: string) {
  return leftBrackets.includes(char);
}

function isRightBrackets(char: string) {
  return rightBrackets.includes(char);
}

function includeBrackets(char: string) {
  return brackets.split('').some(o => char.includes(o));
}

export function parsePattern(input: string): Pattern[] {
  let result: Pattern[] = [];
  let bracketStack: string[] = [];
  let tempValue = '';
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (isLeftBrackets(char)) {
      if (bracketStack.length === 0) {
        if (tempValue.trim()) {
          result.push({ content: tempValue.trim() });
        }
        tempValue = '';
      } else {
        tempValue += char;
      }
      bracketStack.push(char);
    } else if (isRightBrackets(char)) {
      const bracket = bracketStack.pop();
      if (bracketStack.length === 0) {
        let tempResult: string | Pattern[] = tempValue.trim();
        if (includeBrackets(tempValue)) {
          tempResult = parsePattern(tempValue);
        }
        result.push({
          char: bracket,
          content: tempResult,
        });
        tempValue = '';
      } else {
        tempValue += char;
      }
    } else {
      tempValue += char;
    }
  }
  if (tempValue) {
    let tempResult: string | Pattern[] = tempValue.trim();
    if (includeBrackets(tempValue)) {
      tempResult = parsePattern(tempValue);
    }
    result.push({
      content: tempResult,
    });
  }

  return result;
}

function getData<T = any>(data: Pattern[], keys: Pattern[]): Partial<T> {
  let metaIndex = 0;
  let response: any = {};
  for (const index in keys) {
    if (keys.hasOwnProperty(index)) {
      const key = keys[index];
      const meta = data[metaIndex];
      if (meta.char === key.char) {
        if (Array.isArray(key.content)) {
          if (Array.isArray(meta.content)) {
            response = Object.assign(response, getData(meta.content, key.content));
          } else {
            response = Object.assign(response, getData([{ content: meta.content }], key.content));
          }
        } else {
          if (response[key.content] && typeof response[key.content] === 'string') {
            response[key.content] = response[key.content] + meta.content;
          } else {
            response[key.content] = meta.content;
          }
        }
        metaIndex++;
        if (metaIndex === data.length) {
          return response;
        }
      }
    }
  }
  return response;
}

export function parseTitle(title: string, pattern: string) {
  return getData(parsePattern(title), parsePattern(pattern));
}
