[Back](../index.md)

# DOMImage

## Import

Import **DOMImage** into your project:

```typescript
import { DOMImage } from '@nekobird/rocket';
```

## Interfaces

### DOMImagePromiseValue

```typescript
image: HTMLImageElement;
source: string;
width: number;
height: number;
```
## Static Methods

### loadImageFromSource

`loadImageFromSource(source: string): Promise<DOMImagePromiseValue>`

Wait for an image to load and return a promise object with the loaded `Image` object and other useful properties.

#### Example

```typescript
// Wait for image.png to load
DOMImage.loadImageFromSource('https://somewebsite.com/image.png')
  .then(result => {
    // Then append it loaded Image object to an element.
    element.appendChild(result.image);
  });
```

### getImageSizeFromSource

```
getImageSizeFromSource(
  source: string,
  timeoutInSeconds: number = 1,
  checkIntervalInMilliseconds: number = 10
): Promise<Size>
```

Get image [`Size`](../interfaces.md#size) before it is fully loaded.

By default it will timeout after 1 second and will reject the promise.

#### Example

```typescript
DOMImage.getImageSizeFromSource('https://somewebsite.com/image.png')
  .then(result => {
    // Returns the image width.
    console.log(result.width);
  });
```