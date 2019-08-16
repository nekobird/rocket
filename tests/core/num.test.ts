import {
  Num,
} from '../../rocket/rocket';

describe('Num.average', () => {
  test('should return the average of numbers', () => {
    expect(Num.average(1, 2, 3, 4)).toBe(2.5);
  });

  test('should return an error if given an array with less than two numbers', () => {
    expect(() => Num.average(1)).toThrow();
  });
});

describe('Num.constrain', () => {
  test('Should constrain number within range', () => {
    expect(Num.constrain(11, 10)).toBe(10);
  });

  test('Should constrain number within range', () => {
    expect(Num.constrain(5, 10)).toBe(5);
  });

  test('Should constrain number within range', () => {
    expect(Num.constrain(4, [5, 10])).toBe(5);
  });
});

describe('Num.cycle', () => {
  test('Should return 1 if number is 1 beyond the cycle limit', () => {
    expect(Num.cycle(2, 1)).toBe(1);
  });
});

describe('Num.getEuclideanDistance', () => {
  test('Should return the correct value if both a and b are positive integers.', () => {
    expect(Num.getEuclideanDistance(5, 1)).toBe(4);
    expect(Num.getEuclideanDistance(1, 5)).toBe(4);
  });

  test('Should return the correct value and both a and b are negative integers.', () => {
    expect(Num.getEuclideanDistance(-8, -2)).toBe(6);
    expect(Num.getEuclideanDistance(-2, -8)).toBe(6);
  });

  test('Should return the correct value if one is negative and the other positive.', () => {
    expect(Num.getEuclideanDistance(-8, 2)).toBe(10);
    expect(Num.getEuclideanDistance(2, -8)).toBe(10);
  });
});
