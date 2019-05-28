import {
  Num,
} from '../../rocket/rocket';

test('should return the average of numbers', () => {
  expect(Num.average([1, 2, 3, 4])).toBe(2.5);
});

test('should return an error if given an array with less than two numbers', () => {
  expect(() => Num.average([1])).toThrow();
})