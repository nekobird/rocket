export class StringUtil {

  public static upperCaseFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  public static lowerCaseFirstLetter(string: string): string {
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
}
