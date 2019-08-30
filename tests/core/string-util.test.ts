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

describe('StringUtil.isKebabCase', () => {
  test('should return true if stings are kebab case', () => {
    expect(StringUtil.isKebabCase('abc')).toBe(true);
    expect(StringUtil.isKebabCase('abc', 'ab-c')).toBe(true);
    expect(StringUtil.isKebabCase('abc', 'ab-c', 'a_bc')).toBe(false);
    expect(StringUtil.isKebabCase('abc', 'aBc', 'a_bc')).toBe(false);

    expect(StringUtil.isKebabCase('abc', ' abc', 'abc')).toBe(false);
  });
});

describe('StringUtil.kebabCaseToCamelCase', () => {
  test('should convert string from kebab case to camel case', () => {
    expect(StringUtil.kebabCaseToCamelCase('abc')).toBe('abc');
    expect(StringUtil.kebabCaseToCamelCase('ab-c')).toBe('abC');
    expect(StringUtil.kebabCaseToCamelCase('ab_c')).toBe('ab_c');
  });
});