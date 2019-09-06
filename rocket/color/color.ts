import {
  ConvertColor,
  Num,
  StringUtil,
} from '../rocket';

type ColorArray3 = [number, number, number];

type ColorArray4 = [number, number, number, number];

// Range
// A   : 1
// RGB : 1  , 1, 1
// HSL : 359, 1, 1
// HSV : 359, 1, 1
// CYMK: 1  , 1, 1, 1

const NAMED_COLOR_SET = {
  azure: [0, 0.5, 1, 1],
  black: [0, 0, 0, 1],
  blue: [0, 0, 1, 1],
  brown: [0.6, 0.3, 0, 1],
  clear: [0, 0, 0, 0],
  cyan: [0, 1, 1, 1],
  gray: [0.5, 0.5, 0.5, 1],
  green: [0, 1, 0, 1],
  magenta: [1, 0, 1, 1],
  orange: [1, 0.5, 0, 1],
  pink: [1, 0.8, 0.86, 1],
  purple: [0.5, 0, 0.5, 1],
  red: [1, 0, 0, 1],
  salmon: [0.98, 0.5, 0.45, 1],
  transparent: [0, 0, 0, 0],
  ultramarine: [0.25, 0, 1, 1],
  violet: [0.5, 0, 1, 1],
  white: [1, 1, 1, 1],
  yellow: [1, 1, 0, 1],
};

const COLOR_INPUT_REGEX = {
  hex: /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/g,
  hsl: /^(hsl|HSL)\((360|3[0-5][0-9]|2[0-9][0-9]|1[0-9][0-9]|[1-9]?[0-9]),\s?(100|[1-9]?[0-9])\%?,\s?(100|[1-9]?[0-9])\%?\)$/g,
  hsla: /^(hsla|HSLA)\((360|3[0-5][0-9]|2[0-9][0-9]|1[0-9][0-9]|[1-9]?[0-9]),\s?(100|[1-9]?[0-9])\%?,\s?(100|[1-9]?[0-9])\%?,\s?(1|0|0\.([0-9]?)+[1-9])\)$/g,
  rgb: /^(rgb|RGB)\((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]),\s?(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]),\s?(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\)$/g,
  rgba: /^(rgba|RGBA)\((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]),\s?(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]),\s?(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]),\s?(1|0|0\.([0-9]?){1,5}[1-9])\)$/g,
};

export class Color {
  public r: number = 0;
  public g: number = 0;
  public b: number = 0;
  public a: number = 1;

  constructor(input?) {
    if (typeof input !== 'undefined') {
      this.set(input);
    }
  }

  public equals(color: Color): this {
    if (Color.isColor(color) === true) {
      this.r = color.r;
      this.g = color.g;
      this.b = color.b;
      this.a = color.a;
    }

    return this;
  }

  public clone(): Color {
    return Color.clone(this);
  }

  public set(input) {
    if (Color.isColor(input)) {
      this.equals(input);
    } else if (typeof input === 'string') {
      this.colorString = input;
    } else {
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.a = 1;
    }

    return this;
  }

  set colorString(input: string) {
    if (typeof NAMED_COLOR_SET[input] !== 'undefined') {
      this.rgba = NAMED_COLOR_SET[input];
    } else if (typeof StringUtil.match(input, COLOR_INPUT_REGEX.hex) === 'string') {
      this.hex = input;
    } else if (typeof StringUtil.match(input, COLOR_INPUT_REGEX.rgb) === 'string') {
      this.rgbString = input;
    } else if (typeof StringUtil.match(input, COLOR_INPUT_REGEX.rgba) === 'string') {
      this.rgbaString = input;
    } else if (typeof StringUtil.match(input, COLOR_INPUT_REGEX.hsl) === 'string') {
      this.hslString = input;
    } else if (typeof StringUtil.match(input, COLOR_INPUT_REGEX.hsla) === 'string') {
      this.hslaString = input;
    }
  }

  // GETTERS AND SETTERS

  // STRINGS
  set rgbString(input: string) {
    const numbers = input.match(/(\d+)/g);

    if (numbers !== null) {
      const rgb = numbers.map(v => {
        return Num.cycle(parseFloat(v) / 255, 1);
      });

      this.r = rgb[0];
      this.g = rgb[1];
      this.b = rgb[2];
    }
  }

  set rgbaString(input: string) {
    const numbers = input.match(/([\d]+(\.[\d]+)?)/g);

    if (numbers !== null) {
      const rgba = numbers.map((v, index) => {
        if (index === 3) {
          return Num.cycle(parseFloat(v), 1);
        }

        return Num.cycle(parseFloat(v) / 255, 1);
      });

      this.r = rgba[0];
      this.g = rgba[1];
      this.b = rgba[2];
      this.a = rgba[3];
    }
  }

  set hslString(input: string) {
    const numbers = input.match(/(\d+)/g);

    if (numbers !== null) {
      const hsl = numbers.map(v => parseFloat(v));

      hsl[1] /= 100;
      hsl[2] /= 100;

      const rgb = ConvertColor.HSLToRGB(...hsl as ColorArray3);

      this.r = rgb[0];
      this.g = rgb[1];
      this.b = rgb[2];
    }
  }

  set hslaString(input: string) {
    const numbers = input.match(/([\d]+(\.[\d]+)?)/g);

    if (numbers !== null) {
      const hsla = numbers.map(v => parseFloat(v));

      const hsl = hsla.slice(0, 3);

      hsl[1] /= 100;
      hsl[2] /= 100;

      const rgb = ConvertColor.HSLToRGB(...hsl as ColorArray3);

      this.r = rgb[0];
      this.g = rgb[1];
      this.b = rgb[2];
      this.a = Num.cycle(hsla[3], 1);
    }
  }

  // These will always return HTML color format.
  get rgbString(): string {
    const rgb = this.rgb255;

    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }

  get rgbaString(): string {
    const rgba = this.rgb255;

    return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${this.a})`;
  }

  get hslString(): string {
    const hsl = this.hsl;

    const s = (hsl[1] * 100).toFixed(0);
    const l = (hsl[2] * 100).toFixed(0);

    return `hsl(${hsl[0]}, %${s}, ${l})`;
  }

  get hslaString(): string {
    const hsl = this.hsl;

    const s = (hsl[1] * 100).toFixed(0);
    const l = (hsl[2] * 100).toFixed(0);

    return `hsl(${hsl[0]}, %${s}, ${l}, ${this.a})`;
  }

  set hexString(hex: string) {
    this.hex = hex;
  }

  get hexString(): string {
    return this.hex;
  }

  // HEX

  set hex(hex: string) {
    const rgb = ConvertColor.HEXToRGB(hex);

    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];
  }

  get hex(): string {
    const rgb = [this.r, this.g, this.b] as ColorArray3;

    return ConvertColor.RGBToHEX(...rgb);
  }

  // RGB

  set rgb255(rgb: ColorArray3) {
    this.r = Num.cycle(rgb[0] / 255, 1);
    this.g = Num.cycle(rgb[1] / 255, 1);
    this.b = Num.cycle(rgb[2] / 255, 1);
  }

  get rgb255(): ColorArray3 {
    const rgb = [this.r, this.g, this.b];

    return rgb.map(v => Math.round(v * 255)) as ColorArray3;
  }

  set rgb(rgb: ColorArray3) {
    this.r = Num.cycle(rgb[0], 1);
    this.g = Num.cycle(rgb[1], 1);
    this.b = Num.cycle(rgb[2], 1);
  }

  get rgb(): ColorArray3 {
    return [this.r, this.g, this.b];
  }

  // RGBA

  set rgba255(rgba: ColorArray4) {
    this.r = Num.cycle(rgba[0], 1);
    this.g = Num.cycle(rgba[1], 1);
    this.b = Num.cycle(rgba[2], 1);
    this.a = Num.cycle(rgba[3], 1);
  }

  get rgba255(): ColorArray4 {
    return [this.r, this.g, this.b, this.a];
  }

  set rgba(rgba: ColorArray4) {
    this.r = Num.cycle(rgba[0], 1);
    this.g = Num.cycle(rgba[1], 1);
    this.b = Num.cycle(rgba[2], 1);
    this.a = Num.cycle(rgba[3], 1);
  }

  get rgba(): ColorArray4 {
    return [this.r, this.g, this.b, this.a];
  }

  // HSL

  set hsl(hsl: ColorArray3) {
    const rgb = ConvertColor.HSLToRGB(...hsl);

    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];
  }

  get hsl(): ColorArray3 {
    return ConvertColor.RGBToHSL(this.r, this.g, this.b);
  }

  // HSV and HSB

  set hsv(hsv: ColorArray3) {
    if (hsv.length === 3) {
      const rgb = ConvertColor.HSVToRGB(...hsv);

      this.r = rgb[0];
      this.g = rgb[1];
      this.b = rgb[2];
    }
  }

  get hsv(): ColorArray3 {
    return ConvertColor.HSVToRGB(this.r, this.g, this.b);
  }

  // CMYK

  set cmyk(cmyk: ColorArray4) {
    const rgb = ConvertColor.CMYKToRGB(...cmyk);

    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];
  }

  get cmyk(): ColorArray4 {
    return ConvertColor.RGBToCMYK(this.r, this.g, this.b);
  }

  // RED

  set red255(red: number) {
    this.r = Num.cycle(red / 255, 1);
  }

  get red255(): number {
    return Math.round(this.r * 255);
  }

  set red(red: number) {
    this.r = red;
  }

  get red(): number {
    return this.r;
  }

  // GREEN

  set green255(green: number) {
    this.g = Num.cycle(green / 255, 1);
  }

  get green255(): number {
    return Math.round(this.g * 255);
  }

  set green(green: number) {
    this.g = green;
  }

  get green(): number {
    return this.g;
  }

  // BLUE

  set blue255(blue: number) {
    this.b = Num.cycle(blue / 255, 1);
  }

  get blue255(): number {
    return Math.round(this.b * 255);
  }

  set blue(blue: number) {
    this.b = blue;
  }

  get blue(): number {
    return this.b;
  }

  // CYAN

  set cyan(cyan: number) {
    const cmyk = ConvertColor.RGBToCMYK(this.r, this.g, this.b);

    cmyk[0] = cyan;

    const rgb = ConvertColor.CMYKToRGB(...cmyk);

    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];
  }

  get cyan(): number {
    return ConvertColor.RGBToCMYK(this.r, this.g, this.b)[0];
  }

  // MAGENTA

  set magenta(magenta: number) {
    const cmyk = ConvertColor.RGBToCMYK(this.r, this.g, this.b);

    cmyk[1] = magenta;

    const rgb = ConvertColor.CMYKToRGB(...cmyk);

    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];
  }

  get magenta(): number {
    return ConvertColor.RGBToCMYK(this.r, this.g, this.b)[1];
  }

  // YELLOW

  set yellow(yellow: number) {
    const cmyk = ConvertColor.RGBToCMYK(this.r, this.g, this.b);

    cmyk[2] = yellow;

    const rgb = ConvertColor.CMYKToRGB(...cmyk);

    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];
  }

  get yellow(): number {
    return ConvertColor.RGBToCMYK(this.r, this.g, this.b)[2];
  }

  // ALPHA

  set alpha(alpha: number) {
    this.a = Num.cycle(alpha, 1);
  }

  get alpha(): number {
    return this.a;
  }

  // HUE

  set hue(degrees: number) {
    const hsl = ConvertColor.RGBToHSL(this.r, this.g, this.b);

    hsl[0] = Math.abs(Math.round(Num.cycle(degrees, 359)));

    const rgb = ConvertColor.HSLToRGB(...hsl);

    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];
  }

  get hue(): number {
    const hsl = ConvertColor.RGBToHSL(this.r, this.g, this.b);

    return Math.round(hsl[0]);
  }

  // SATURATION

  set saturation(saturation: number) {
    const hsl = ConvertColor.RGBToHSL(this.r, this.g, this.b);

    hsl[1] = Num.cycle(saturation, 1);

    const rgb = ConvertColor.HSLToRGB(...hsl);

    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];
  }

  get saturation(): number {
    const hsl = ConvertColor.RGBToHSL(this.r, this.g, this.b);

    return hsl[1];
  }

  // VALUE

  set value(value: number) {
    const hsv = ConvertColor.RGBToHSV(this.r, this.g, this.b);

    hsv[2] = Num.cycle(value, 1);

    const rgb = ConvertColor.HSVToRGB(...hsv);

    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];
  }

  get value(): number {
    const hsv = ConvertColor.RGBToHSV(this.r, this.g, this.b);

    return hsv[2];
  }

  get brightness(): number {
    return Math.sqrt(
      0.299 * this.r * this.r
      + 0.587 * this.g * this.g
      + 0.114 * this.b * this.b
    );
  }

  // MODIFIER

  public hueRotate(increment: number): this {
    this.hue += increment;

    return this;
  }

  public invert(): this {
    this.r = 1 - this.r;
    this.g = 1 - this.g;
    this.b = 1 - this.b;

    return this;
  }

  // INTERPOLATION

  public lerp(target: Color, t: number): this {
    this.r = Num.lerp(t, this.r, target.r);
    this.g = Num.lerp(t, this.g, target.g);
    this.b = Num.lerp(t, this.b, target.b);
    this.a = Num.lerp(t, this.a, target.a);

    return this;
  }

  // @static

  static isColor(color): boolean {
    return typeof color === 'object' && color instanceof Color;
  }

  static clone(color: Color): Color {
    return new Color(color);
  }

  static triadic(color: Color): [Color, Color, Color] {
    const color_a = color.clone().hueRotate(-120);
    const color_c = color.clone().hueRotate(120);

    return [color_a, color, color_c];
  }

  static complement(color: Color): Color {
    return color.clone().hueRotate(180);
  }

  static splitComplements(color: Color): [Color, Color, Color] {
    const color_a = color.clone().hueRotate(-150);
    const color_c = color.clone().hueRotate(150);

    return [color_a, color, color_c];
  }

  static analogous(color: Color): [Color, Color, Color] {
    const color_a = color.clone().hueRotate(-30);
    const color_c = color.clone().hueRotate(30);

    return [color_a, color, color_c];
  }

  static lerp(t: number, color_a: Color, color_b: Color): Color {
    const color = Color.clone(color_a);

    color.r = Num.lerp(t, color_a.r, color_b.r);
    color.g = Num.lerp(t, color_a.g, color_b.g);
    color.b = Num.lerp(t, color_a.b, color_b.b);
    color.a = Num.lerp(t, color_a.a, color_b.a);

    return color;
  }
}
