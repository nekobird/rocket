import {
  DOMStyle,
} from '../../rocket/rocket';

describe('DOMStyle.getFontSize', () => {
  test('should return the correct fontSize', () => {
    document.body.innerHTML =
      `<div
        id="test"
        style="font-size: 14px">
        Andrew
      </div>`;
    const testElement = document.getElementById('test');
    if (testElement !== null) {
      expect(DOMStyle.getFontSize(testElement)).toEqual(14);
    }
  });
});

describe('DOMStyle.getHorizontalMargins', () => {
  test('should return 0 when margin left and right is null', () => {
    document.body.innerHTML =
      `<div
        id="test"
        style="
          width: 20px;
        ">
        Andrew
      </div>`;
    const testElement = document.getElementById('test');
    if (testElement !== null) {
      expect(DOMStyle.getHorizontalMargins(testElement)).toEqual(0);
    }
  });

  test('should return a new Rect object', () => {
    document.body.innerHTML =
      `<div
        id="test"
        style="
          margin-left: 20px;
          margin-right: 40px;
          width: 20px;
        ">
        Andrew
      </div>`;
    const testElement = document.getElementById('test');
    if (testElement !== null) {
      expect(DOMStyle.getHorizontalMargins(testElement)).toEqual(60);
    }
  });
});

describe('DOMStyle.getVerticalMargins', () => {
  test('should return a new Rect object', () => {
    document.body.innerHTML =
      `<div
        id="test"
        style="
          margin-top: 20px;
          margin-bottom: 40px;
          height: 20px;
        ">
        Andrew
      </div>`;
    const testElement = document.getElementById('test');
    if (testElement !== null) {
      expect(DOMStyle.getVerticalMargins(testElement)).toEqual(60);
    }
  });
});
