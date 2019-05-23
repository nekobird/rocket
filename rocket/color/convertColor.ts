import {
  Num,
} from '../rocket'

/*
  https://gist.github.com/felipesabino/5066336
  http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
  http://www.tannerhelland.com/3643/grayscale-image-algorithm-vb6/
  http://alienryderflex.com/hsp.html
  http://www.rapidtables.com/convert/color/hsl-to-rgb.htm
  alpha      = 1
  black      = 100
  blue       = 255
  cyan       = 100
  green      = 255
  lightness  = 100
  magenta    = 100
  red        = 255
  saturation = 100
  value      = 100
  yellow     = 100
*/

type ColorArray3 = [number, number, number]
type ColorArray4 = [number, number, number, number]

export class ConvertColor {

  // RGB 1, 1, 1
  static RGBToHEX(rgb: ColorArray3): string {
    rgb[0] = Num.cycle(rgb[0], 1);
    rgb[1] = Num.cycle(rgb[1], 1);
    rgb[2] = Num.cycle(rgb[2], 1);
    rgb = <ColorArray3>rgb.map(n => n * 255);
    return `#${rgb[0].toString(16)}${rgb[1].toString(16)}${rgb[2].toString(16)}`;
  }

  // RGB 1, 1, 1
  static HEXToRGB(hex: string): ColorArray3 {
    let rgb: ColorArray3 = [0, 0, 0];
    let r: string = '';
    let g: string = '';
    let b: string = '';
    if (hex.length === 7) {
      r = hex.substr(1, 2);
      g = hex.substr(3, 2);
      b = hex.substr(5, 2);
    } else if (hex.length === 4) {
      r = hex.substr(1, 1);
      g = hex.substr(2, 1);
      b = hex.substr(3, 1);
      r = r.concat(r);
      g = g.concat(g);
      b = b.concat(b);
    }
    rgb[0] = parseInt(r, 16);
    rgb[1] = parseInt(g, 16);
    rgb[2] = parseInt(b, 16);

    return <ColorArray3>rgb.map(n => n / 255);
  }

  // CMYK 1, 1, 1, 1
  // RGB 1, 1, 1
  static RGBToCMYK(rgb: ColorArray3): ColorArray4 {
    rgb[0] = Num.cycle(rgb[0], 1);
    rgb[1] = Num.cycle(rgb[1], 1);
    rgb[2] = Num.cycle(rgb[2], 1);

    const cmyk: ColorArray4 = [0, 0, 0, 0];

    cmyk[3] = 1 - Math.max.apply(this, rgb);
    cmyk[0] = (1 - rgb[0] - cmyk[3]) / (1 - cmyk[3]);
    cmyk[1] = (1 - rgb[1] - cmyk[3]) / (1 - cmyk[3]);
    cmyk[2] = (1 - rgb[2] - cmyk[3]) / (1 - cmyk[3]);

    return cmyk;
  }

  // CMYK 1, 1, 1, 1
  //  RGB 1, 1, 1
  static CMYKToRGB(cmyk: ColorArray4): ColorArray3 {
    cmyk[0] = Num.cycle(cmyk[0], 1);
    cmyk[1] = Num.cycle(cmyk[1], 1);
    cmyk[2] = Num.cycle(cmyk[2], 1);
    cmyk[3] = Num.cycle(cmyk[3], 1);

    const rgb: ColorArray3 = [0, 0, 0];

    rgb[0] = (1 - cmyk[0]) * (1 - cmyk[3]);
    rgb[1] = (1 - cmyk[1]) * (1 - cmyk[3]);
    rgb[2] = (1 - cmyk[2]) * (1 - cmyk[3]);

    return rgb;
  }

  // RGB   1, 1, 1
  // HSL 359, 1, 1
  static RGBToHSL(rgb: ColorArray3): ColorArray3 {
    rgb[0] = Num.cycle(rgb[0], 1);
    rgb[1] = Num.cycle(rgb[1], 1);
    rgb[2] = Num.cycle(rgb[2], 1);

    let cMax: number = Math.max.apply(this, rgb);
    let cMin: number = Math.min.apply(this, rgb);
    let delta: number = cMax - cMin;
    let hsl: ColorArray3 = [0, 0, 0];

    if (delta === 0) {
      hsl[0] = 0;
    } else if (cMax === rgb[0]) {
      hsl[0] = 60 * (((rgb[1] - rgb[2]) / delta) % 6);
    } else if (cMax === rgb[1]) {
      hsl[0] = 60 * (((rgb[2] - rgb[0]) / delta) + 2);
    } else if (cMax === rgb[2]) {
      hsl[0] = 60 * (((rgb[0] - rgb[1]) / delta) + 4);
    }

    hsl[2] = (cMax + cMin) / 2;
    hsl[1] = delta === 0 ? 0 : delta / (1 - Math.abs(2 * hsl[2] - 1));

    return hsl;
  }

  // HSL 359, 1, 1
  // RGB   1, 1, 1
  static HSLToRGB(hsl: ColorArray3): ColorArray3 {
    hsl[0] = Num.cycle(hsl[0], 359);
    hsl[1] = Num.cycle(hsl[1], 1);
    hsl[2] = Num.cycle(hsl[2], 1);

    let rgb: ColorArray3 = [0, 0, 0];
    let h: number = hsl[0] / 60;
    let c: number = (1 - Math.abs(2 * hsl[2] - 1)) * hsl[1];
    let x: number = c * (1 - Math.abs(h % 2 - 1));

    if (h >= 0 && h <= 1) {
      rgb = [c, x, 0];
    } else if (h >= 1 && h <= 2) {
      rgb = [x, c, 0];
    } else if (h >= 2 && h <= 3) {
      rgb = [0, c, x];
    } else if (h >= 3 && h <= 4) {
      rgb = [0, x, c];
    } else if (h >= 4 && h <= 5) {
      rgb = [x, 0, c];
    } else if (h >= 5 && h <= 6) {
      rgb = [c, 0, x];
    }

    let m: number = hsl[2] - (0.5 * c);

    return <ColorArray3>rgb.map(v => v + m);
  }

  // RGB   1, 1, 1
  // HSV 359, 1, 1
  static RGBToHSV(rgb: ColorArray3): ColorArray3 {
    rgb[0] = Num.cycle(rgb[0], 1);
    rgb[1] = Num.cycle(rgb[1], 1);
    rgb[2] = Num.cycle(rgb[2], 1);

    let cMax = Math.max.apply(this, rgb);
    let cMin = Math.min.apply(this, rgb);
    let delta: number = cMax - cMin;
    let hsv: ColorArray3 = [0, 0, 0];

    if (delta === 0) {
      hsv[0] = 0;
    } else if (cMax === rgb[0]) {
      hsv[0] = 60 * (((rgb[1] - rgb[2]) / delta) % 6);
    } else if (cMax === rgb[1]) {
      hsv[0] = 60 * (((rgb[2] - rgb[0]) / delta) + 2);
    } else if (cMax === rgb[2]) {
      hsv[0] = 60 * (((rgb[0] - rgb[1]) / delta) + 4);
    }

    hsv[1] = cMax === 0 ? 0 : delta / cMax;
    hsv[2] = cMax;

    return hsv;
  }

  // HSV 359, 1, 1
  // RGB   1, 1, 1
  static HSVToRGB(hsv: ColorArray3): ColorArray3 {
    hsv[0] = Num.cycle(hsv[0], 359);
    hsv[1] = Num.cycle(hsv[1], 1);
    hsv[2] = Num.cycle(hsv[2], 1);

    const c: number = hsv[2] * hsv[1];
    const x: number = c * (1 - Math.abs((hsv[0] / 60) % 2 - 1));

    let rgb: ColorArray3 = [0, 0, 0];
    if (
      hsv[0] >= 0
      && hsv[0] <= 60
    ) {
      rgb = [c, x, 0];
    } else if (
      hsv[0] >= 60
      && hsv[0] <= 120
    ) {
      rgb = [x, c, 0];
    } else if (
      hsv[0] >= 120
      && hsv[0] <= 180
    ) {
      rgb = [0, c, x];
    } else if (
      hsv[0] >= 180
      && hsv[0] <= 240
    ) {
      rgb = [0, x, c];
    } else if (
      hsv[0] >= 240
      && hsv[0] <= 300
    ) {
      rgb = [x, 0, c];
    } else if (
      hsv[0] >= 300
      && hsv[0] <= 360
    ) {
      rgb = [c, 0, x];
    }

    const m: number = hsv[2] - c;
    return <ColorArray3>rgb.map(v => v + m);
  }
}