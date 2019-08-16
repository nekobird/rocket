import {
  StringUtil,
} from '../../rocket/rocket';

describe('StringUtil.upperCaseFirstLetter', () => {
  test('should return a string with the first letter uppercased', () => {
    expect(StringUtil.uppercaseFirstLetter('andrew')).toBe('Andrew');
  });
});

describe('StringUtil.lowerCaseFirstLetter', () => {
  test('should return a string with the first letter lowercased', () => {
    expect(StringUtil.lowercaseFirstLetter('Andrew')).toBe('andrew');
  });
});

describe('StringUtil.removeExtraWhitespaces', () => {
  test('should return a string without any whitespaces next to each other', () => {
    expect(StringUtil.removeExtraWhitespaces('  a  b c  ')).toBe(' a b c ');
  });
});

describe('StringUtil.removeTabs', () => {
  test('should return a string without any whitespaces next to each other', () => {
    expect(StringUtil.removeExtraWhitespaces('  abc')).toBe(' abc');
  });
});

describe('StringUtil.removeNewLines', () => {
  test('should return a string without any whitespaces next to each other', () => {
    expect(StringUtil.removeExtraWhitespaces('a\nb')).toBe('a b');
  });
});
