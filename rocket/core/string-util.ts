export type StringOrRegExp = string | RegExp;

export class StringUtil {
  private static isStringOrRegExp(thing: any): boolean {
    return (
      typeof thing === 'string'
      || thing instanceof RegExp
    )
  }

  private static isStringOrRegExpArray(thing: any): boolean {
    return (
      Array.isArray(thing) === true
      && thing.every(member => this.isStringOrRegExp(member))
    )
  }

  public static uppercaseFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  public static lowercaseFirstLetter(string: string): string {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace_in_the_DOM
  public static removeExtraWhitespaces(string: string): string {
    return string.replace(/[\s]+/g, ' ');
  }

  public static removeTabs(string: string): string {
    return string.replace(/[\t]+/g, '');
  }

  public static removeNewLines(string: string): string {
    return string.replace(/[\r\n]+/g, '');
  }

  public static match(string: string, regex: RegExp): string | string[] | false {
    const value = string.match(regex);

    if (value === null) {
      return false;
    } else if (value.length === 1) {
      return value[0];
    }

    return value;
  }

  public static replace(
    string: string,
    patterns: StringOrRegExp,
    replacement: string,
  ): string
  public static replace(
    string: string,
    patterns: StringOrRegExp[],
    replacement: string,
  ): string
  public static replace(
    string: string,
    patterns: StringOrRegExp | StringOrRegExp[],
    replacement: string = '',
  ): string {
    if (this.isStringOrRegExpArray(patterns) === true) {
      patterns = patterns as StringOrRegExp[];

      patterns.forEach(pattern => {
        string = string.replace(pattern, replacement);
      });
    } else if (this.isStringOrRegExp(patterns) === true) {
      let pattern = patterns as StringOrRegExp;

      string = string.replace(pattern, replacement);
    }

    return string;
  }
}
