import {
  Size,
} from '../rocket';

export interface DOMImagePromiseValue {
  image: HTMLImageElement;
  source: string;
  width: number;
  height: number;
}

export class DOMImage {
  public static loadImageFromSource(source: string): Promise<DOMImagePromiseValue> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.addEventListener('load', () => {
        const width = image.width;
        const height = image.height;

        resolve({ image, source, width, height });
      });

      image.addEventListener('error', () => {
        reject(new Error('DOMImage.loadImageFromSource: There is an error loading image.'));
      });

      image.src = source;
    });
  }

  public static getImageSizeFromSource(
    source: string,
    timeoutInSeconds: number = 1,
    checkIntervalInMilliseconds: number = 10
  ): Promise<Size> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.addEventListener('error', () => {
        reject(new Error('DOMImage.getImageSizeFromSource: There is an error loading image.'));
      });

      image.src = source;

      let timeoutId;

      const intervalId = setInterval(
        () => {
          if (
            typeof image.naturalWidth === 'number'
            && typeof image.naturalHeight === 'number'
          ) {
            clearTimeout(timeoutId);
            clearInterval(intervalId);

            resolve({
              width: image.naturalWidth,
              height: image.naturalHeight,
            });
          }
        },
        checkIntervalInMilliseconds
      );

      timeoutId = setTimeout(
        () => {
          clearInterval(intervalId);
          reject(new Error('DOMImage.getImageSizeFromSource: Timeout trying to get image size.'));
        },
        timeoutInSeconds * 1000
      );
    });
  }
}
