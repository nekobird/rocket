export type StringOrRegExp = string | RegExp;

export class StringUtil {
  public static hasUppercaseLetter(...values: string[]): boolean {
    return values.every(value => value !== value.toLowerCase());
  }

  public static isKebabCase(...values: string[]): boolean {
    return values.every(value => {
      return (
        this.hasUppercaseLetter(value) === false
        && value.match(/^([a-z]+|[a-z][a-z\-]+[a-z])$/g) !== null
      )
    });
  }

  public static isSnakeCase(...values: string[]): boolean {
    return values.every(value => {
      return (
        this.hasUppercaseLetter(value) === false
        && value.match(/^([a-z]+|[a-z][a-z\_]+[a-z])$/g) !== null
      )
    });
  }

  public static kebabCaseToCamelCase(from: string): string {
    if (this.isKebabCase(from) === true) {
      return from.replace(/(\-[a-z]{1})/g, match => {
        return match.replace(/[\-]/g, '').toUpperCase();
      });
    }

    return from;
  }

  public static lowercaseFirstLetter(string: string): string {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

  public static match(string: string, regex: RegExp): string | string[] | null {
    const value = string.match(regex);

    if (!value) {
      return null;
    } else if (value.length === 1) {
      return value[0];
    }

    return value;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace_in_the_DOM
  public static removeExtraWhitespaces(string: string): string {
    return string.replace(/[\s]+/g, ' ');
  }

  public static removeNewLines(string: string): string {
    return string.replace(/[\r\n]+/g, '');
  }

  public static removeTabs(string: string): string {
    return string.replace(/[\t]+/g, '');
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter
  public static replace(
    string: string,
    patterns: StringOrRegExp,
    replacement: string | Function,
  ): string

  public static replace(
    string: string,
    patterns: StringOrRegExp[],
    replacement: string | Function,
  ): string
  
  public static replace(
    string: string,
    patterns: StringOrRegExp | StringOrRegExp[],
    replacement: string | Function = '',
  ): string {
    if (this.isStringOrRegExpArray(patterns) === true) {
      patterns = patterns as StringOrRegExp[];

      patterns.forEach(pattern => {
        string = string.replace(pattern, replacement as string);
      });
    } else if (this.isStringOrRegExp(patterns) === true) {
      let pattern = patterns as StringOrRegExp;

      string = string.replace(pattern, replacement as string);
    }

    return string;
  }

  public static uppercaseFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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
}
