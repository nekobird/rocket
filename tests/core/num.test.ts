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

describe('Num.clamp', () => {
  test('Should constrain number within range', () => {
    expect(Num.clamp(11, 10)).toBe(10);

    expect(Num.clamp(5, 10)).toBe(5);

    expect(Num.clamp(4, [5, 10])).toBe(5);    
    expect(Num.clamp(4, 5, 10)).toBe(5);
  });
});

describe('Num.countDigits', () => {
  test('Should return the number of digits from given value', () => {
    expect(Num.countDigits(123)).toBe(3);
    expect(Num.countDigits(123.123)).toBe(6);
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

describe('Num.getSign', () => {
  test('Should return -1 if negative and 1 if positive or zero.', () => {
    expect(Num.getSign(-123)).toBe(-1);
    expect(Num.getSign(123)).toBe(1);
    expect(Num.getSign(0)).toBe(1);
    expect(Num.getSign(-0)).toBe(1);
  });
});

describe('Num.hypotenuse', () => {
  test('Should return hypotenuse if two sides are given', () => {
    expect(Num.hypotenuse(3, 4)).toBe(5);
    expect(Num.hypotenuse(6, 8)).toBe(10);
  });
});

describe('Num.lerp', () => {
  test('Should return 1 if number is 1 beyond the cycle limit', () => {
    expect(Num.lerp(0.5, 0, 100)).toBe(50);
    expect(Num.lerp(1.5, 0, 100)).toBe(150);
  });
});

describe('Num.reciprocal', () => {
  test('Should return reciprocal', () => {
    expect(Num.reciprocal(5)).toBe(0.2);
  });
});

describe('Num.roundTo', () => {
  test('Should roundTo', () => {
    expect(Num.roundTo(1.5)).toBe(2);
    expect(Num.roundTo(3.1415, 2)).toBe(3.14);
  });
});

describe('Num.sum', () => {
  test('Should sum of numbers given', () => {
    expect(Num.sum(1, 2, 3, 4, 5, 6, 7, 8, 9)).toBe(45);
    expect(Num.sum(0, 1, 2, 3)).toBe(6);
  });
});

describe('Num.transform', () => {
  test('Should transform number from one range to another', () => {
    expect(Num.transform(0.5, 1, 2)).toBe(1);

    expect(Num.transform(0.5, [1, 2], 2, true)).toBe(0);

    expect(Num.transform(3, [1, 2], 2, true)).toBe(2);

    expect(Num.transform(0, [1, 2], 1, false)).toBe(-1);

    expect(Num.transform(3, [1, 2], 1, false)).toBe(2);
  });
});

describe('Num.within', () => {
  test('Should return true if values are within range', () => {
    expect(Num.within(0.5, 1)).toBe(true);
    expect(Num.within(0, 1)).toBe(true);
    expect(Num.within(1, 1)).toBe(true);

    expect(Num.within(1.5, 1, 2)).toBe(true);
    expect(Num.within(1, 1, 2)).toBe(true);
    expect(Num.within(2, 1, 2)).toBe(true);

    expect(Num.within(1.5, [1, 2])).toBe(true);
    expect(Num.within(1, [1, 2])).toBe(true);
    expect(Num.within(2, [1, 2])).toBe(true);

    expect(Num.within(0, 1, true)).toBe(false);
    expect(Num.within(0.5, 1, true)).toBe(true);
    expect(Num.within(1, 1, true)).toBe(false);

    expect(Num.within(1, 1, 2, true)).toBe(false);
    expect(Num.within(1.5, 1, 2, true)).toBe(true);
    expect(Num.within(2, 1, 2, true)).toBe(false);

    expect(Num.within(1, [1, 2], true)).toBe(false);
    expect(Num.within(1.5, [1, 2], true)).toBe(true);
    expect(Num.within(2, [1, 2], true)).toBe(false);
  });
});