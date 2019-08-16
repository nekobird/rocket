[Back](../index.md)

# StringUtil

A set of string utilities.

## Import

Import **StringUtil** into your project file.

```typescript
import { StringUtil } from '@nekobird/rocket';
```

## Static Methods

### uppercaseFirstLetter

`uppercaseFirstLetter(string: string): string`

Returns string with uppercased first letter.

#### Example

```typescript
// Returns 'Andrew'.
StringUtil.uppercaseFirstLetter('andrew');
```

### lowercaseFirstLetter

`lowercaseFirstLetter(string: string): string`

Returns string with the first letter lowercased.

#### Example

```typescript
// Returns 'hello'.
StringUtil.lowercaseFirstLetter('Hello');
```

### removeExtraWhitespaces

`removeExtraWhitespaces(string: string): string`

Remove any extra whitespaces (more than one).

#### Example

```typescript
// Returns ' a b c';
StringUtil.removeExtraWhitespaces(' a  b c');
```

### removeTabs

`removeTabs(string: string): string`

Remove any tab characters from string.

### removeNewLines

`removeNewLines(string: string): string`

Remove any new line characters from string.

### match

`match(string: string, regex: RegExp): string | string[] | false`

It is similar to JavaScript [`string.match(regEx)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) with a few differences.

It returns false instead of null if there is no match.
If there is only one match, it returns the matched string instead of an array.