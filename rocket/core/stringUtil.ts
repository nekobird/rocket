export class StringUtil {

  public static upperCaseFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  public static lowerCaseFirstLetter(string: string): string {
    return string.charAt(0).toLowerCase() + string.slice(1)
  }

}