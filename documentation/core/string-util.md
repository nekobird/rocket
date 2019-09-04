[Back](../index.md)

# StringUtil

A set of string utilities.

## Table of Contents

- [StringUtil](#stringutil)
  - [Table of Contents](#table-of-contents)
  - [Import](#import)
  - [Static Methods](#static-methods)
    - [hasUppercaseLetter](#hasuppercaseletter)
    - [isKebabCase](#iskebabcase)
    - [isSnakeCase](#issnakecase)
    - [kebabCaseToCamelCase](#kebabcasetocamelcase)
    - [lowercaseFirstLetter](#lowercasefirstletter)
    - [match](#match)
    - [removeExtraWhitespaces](#removeextrawhitespaces)
    - [removeNewLines](#removenewlines)
    - [removeTabs](#removetabs)
    - [replace](#replace)
    - [uppercaseFirstLetter](#uppercasefirstletter)

## Import

Import **`StringUtil`** into your project file.

```typescript
import { StringUtil } from '@nekobird/rocket';
```

## Static Methods

### hasUppercaseLetter

`hasUppercaseLetter(...values: string[]): boolean`

Returns true if each string argument has at least one uppercase letter.

**Examples**

```typescript
// Returns true
StringUtil.hasUppercaseLetter('Abc', 'Def');

// Returns false
StringUtil.hasUppercaseLetter('abc', 'dEf');
```

### isKebabCase

`isKebabCase(...values: string[]): boolean`

Returns true if each string argument is kebab case.

**Examples**

```typescript
// Returns true
StringUtil.isKebabCase('animal-cat', 'animal-dog');

// Returns false
StringUtil.isKebabCase('AnimalCat', 'animal-cat', 'dog_101');
```

### isSnakeCase

`isSnakeCase(...values: string[]): boolean`

Returns true if each string argument is snake case.

**Examples**

```typescript
// Returns true
StringUtil.isSnakeCase('animal_cat', 'animal_dog');

// Returns false
StringUtil.isSnakeCase('AnimalCat', 'animal-cat', 'dog_101');
```

### kebabCaseToCamelCase

`kebabCaseToCamelCase(from: string): string`

### lowercaseFirstLetter

`lowercaseFirstLetter(string: string): string`

Returns string with the first letter lowercased.

**Example**

```typescript
// Returns 'hello'.
StringUtil.lowercaseFirstLetter('Hello');
```

### match

`match(string: string, regex: RegExp): string | string[] | false`

It is similar to JavaScript [`string.match(regEx)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) with a few differences.

It returns false instead of null if there is no match.
If there is only one match, it returns the matched string instead of an array.

### removeExtraWhitespaces

`removeExtraWhitespaces(string: string): string`

Remove any extra whitespaces (more than one).

**Example**

```typescript
// Returns ' a b c';
StringUtil.removeExtraWhitespaces(' a  b c');
```

### removeNewLines

`removeNewLines(string: string): string`

Remove any new line characters from string.

### removeTabs

`removeTabs(string: string): string`

Remove any tab characters from string.

### replace

```
replace(
  string: string,
  patterns: StringOrRegExp,
  replacement: string | Function,
): string

replace(
  string: string,
  patterns: StringOrRegExp[],
  replacement: string | Function,
): string
```

### uppercaseFirstLetter

`uppercaseFirstLetter(string: string): string`

Returns string with uppercased first letter.

**Example**

```typescript
// Returns 'Andrew'.
StringUtil.uppercaseFirstLetter('andrew');
```
