import {
  RectHelper,
} from '../../rocket/rocket';

describe('Rect.newRect', () => {
  test('should return a new Rect object', () => {
    expect(RectHelper.newRect(2, 1)).toEqual({ width: 2, height: 1});
  });
});

describe('Rect.scale', () => {
  test('Should scale Rect', () => {
    const rect = { width: 1, height: 1 };
    const result = RectHelper.scale(rect, 2);
    expect(result).toEqual({ width: 2, height: 2});
  });

  test('Should mutate original Rect object', () => {
    const rect = { width: 1, height: 1 };
    const result = RectHelper.scale(rect, 2, true);
    expect(result).toBe(rect);
  });

  test('Should not mutate original Rect object', () => {
    const rect = { width: 1, height: 1 };
    const result = RectHelper.scale(rect, 2);
    expect(result).not.toBe(rect);
  });
});