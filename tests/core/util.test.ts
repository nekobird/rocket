import {
  Util,
} from '../../rocket/rocket';

describe('Util.cycleArray', () => {
  test('should cycle array based on index offset.', () => {
    expect(Util.cycleArray([1, 2, 3], 3)).toBe(1);
  });

});

describe('Util.isObject', () => {
  test('should return false if null is given', () => {
    expect(Util.isObject(null)).toBe(false);
  });
});
