export function scrollLeft(): number {
  if (typeof window.pageXOffset === 'number') {
    return window.pageXOffset;
  }

  return document.documentElement.scrollLeft
    || document.body.scrollLeft
    || window.scrollX
    || 0;
}

export function scrollTop(): number {
  if (typeof window.pageYOffset === 'number') {
    return window.pageYOffset;
  }

  return document.documentElement.scrollTop
    || document.body.scrollTop
    || window.scrollY
    || 0;
}

export function getRandomInteger(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}