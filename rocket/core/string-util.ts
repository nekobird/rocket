export class StringUtil {
  public static uppercaseFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  public static lowercaseFirstLetter(string: string): string {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

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
}
