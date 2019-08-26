export class StringUtil {
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
    patterns: (string | RegExp) | (string | RegExp)[],
    replacement: string = ''
  ): string {
    if (Array.isArray(patterns) === true) {
      patterns = patterns as (string | RegExp)[];

      patterns.forEach(pattern => {
        string = string.replace(pattern, replacement);
      });
    } else {
      let pattern = patterns as (string | RegExp);

      string = string.replace(pattern, replacement);
    }

    return string;
  }
}
