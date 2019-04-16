import {
  ConvertColor,
  Num,
  Util,
} from '../Rocket'

type ColorArray4 = [number, number, number, number]
type ColorArray3 = [number, number, number]

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
}

const COLOR_INPUT_REGEX = {
  hex: /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/g,
  hsl: /^(hsl|HSL)\((360|3[0-5][0-9]|2[0-9][0-9]|1[0-9][0-9]|[1-9]?[0-9]),\s?(100|[1-9]?[0-9])\%?,\s?(100|[1-9]?[0-9])\%?\)$/g,
  hsla: /^(hsla|HSLA)\((360|3[0-5][0-9]|2[0-9][0-9]|1[0-9][0-9]|[1-9]?[0-9]),\s?(100|[1-9]?[0-9])\%?,\s?(100|[1-9]?[0-9])\%?,\s?(1|0|0\.([0-9]?)+[1-9])\)$/g,
  rgb: /^(rgb|RGB)\((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]),\s?(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]),\s?(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\)$/g,
  rgba: /^(rgba|RGBA)\((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]),\s?(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]),\s?(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]),\s?(1|0|0\.([0-9]?){1,5}[1-9])\)$/g,
}

export class Color {

  public r: number = 0
  public g: number = 0
  public b: number = 0
  public a: number = 1

  constructor(input?) {
    if (typeof input !== 'undefined') {
      this.set(input)
    }
    return this
  }

  equals(color: Color): Color {
    this.r = color.r
    this.g = color.g
    this.b = color.b
    this.a = color.a
    return this
  }

  get clone(): Color {
    return Color.equals(this)
  }

  set(input) {
    if (Color.isColor(input)) {
      this.equals(input)
    } else if (typeof input === 'string') {
      this.colorString = input
    } else {
      this.r = 0
      this.g = 0
      this.b = 0
      this.a = 1
    }
    return this
  }

  set colorString(input: string) {
    if (typeof NAMED_COLOR_SET[input] !== 'undefined') {
      this.rgba = NAMED_COLOR_SET[input]
    } else if (typeof Util.match(input, COLOR_INPUT_REGEX.hex) === 'string') {
      this.hex = input
    } else if (typeof Util.match(input, COLOR_INPUT_REGEX.rgb) === 'string') {
      this.rgbString = input
    } else if (typeof Util.match(input, COLOR_INPUT_REGEX.rgba) === 'string') {
      this.rgbaString = input
    } else if (typeof Util.match(input, COLOR_INPUT_REGEX.hsl) === 'string') {
      this.hslString = input
    } else if (typeof Util.match(input, COLOR_INPUT_REGEX.hsla) === 'string') {
      this.hslaString = input
    }
  }

  // GETTERS AND SETTERS

  // STRINGS
  set rgbString(input: string) {
    let rgb: number[] = input.match(/(\d+)/g).map(v => {
      return Num.cycle(parseFloat(v) / 255, 1)
    })
    this.r = rgb[0]
    this.g = rgb[1]
    this.b = rgb[2]
  }

  set rgbaString(input: string) {
    let rgba: number[] = input.match(/([\d]+(\.[\d]+)?)/g).map((v, index) => {
      if (index === 3) {
        return Num.cycle(parseFloat(v), 1)
      } else {
        return Num.cycle(parseFloat(v) / 255, 1)
      }
    })
    this.r = rgba[0]
    this.g = rgba[1]
    this.b = rgba[2]
    this.a = rgba[3]
  }

  set hslString(input: string) {
    let hsl: number[] = input.match(/(\d+)/g).map(v => {
      return parseFloat(v)
    })
    hsl[1] = hsl[1] / 100, 1
    hsl[2] = hsl[2] / 100, 1
    const rgb: ColorArray3 = ConvertColor.HSLToRGB(<ColorArray3>hsl)
    this.r = rgb[0]
    this.g = rgb[1]
    this.b = rgb[2]
  }

  set hslaString(input: string) {
    let hsla: number[] = input.match(/([\d]+(\.[\d]+)?)/g).map(v => {
      return parseFloat(v)
    })
    let hsl: number[] = hsla.slice(0, 3)
    hsl[1] = hsl[1] / 100
    hsl[2] = hsl[2] / 100
    const rgb: ColorArray3 = ConvertColor.HSLToRGB(<ColorArray3>hsl)
    this.r = rgb[0]
    this.g = rgb[1]
    this.b = rgb[2]
    this.a = Num.cycle(hsla[3], 1)
  }

  // These will always return HTML color format.
  get rgbString(): string {
    const rgb: ColorArray3 = this.rgb255
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
  }

  get rgbaString(): string {
    let rgba: ColorArray3 = this.rgb255
    return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${this.a})`
  }

  get hslString(): string {
    let hsl: ColorArray3 = this.hsl
    const s = (hsl[1] * 100).toFixed(0)
    const l = (hsl[2] * 100).toFixed(0)
    return `hsl(${hsl[0]}, %${s}, ${l})`
  }

  get hslaString(): string {
    let hsl: ColorArray3 = this.hsl
    const s = (hsl[1] * 100).toFixed(0)
    const l = (hsl[2] * 100).toFixed(0)
    return `hsl(${hsl[0]}, %${s}, ${l}, ${this.a})`
  }

  // Alias to this.hex
  set hexString(hex: string) {
    this.hex = hex
  }

  get hexString(): string {
    return this.hex
  }

  // HEX

  set hex(hex: string) {
    let rgb: ColorArray3 = ConvertColor.HEXToRGB(hex)
    this.r = rgb[0]
    this.g = rgb[1]
    this.b = rgb[2]
  }

  get hex(): string {
    let rgb: ColorArray3 = [this.r, this.g, this.b]
    return ConvertColor.RGBToHEX(rgb)
  }

  // RGB

  set rgb255(rgb: ColorArray3) {
    this.r = Num.cycle(rgb[0] / 255, 1)
    this.g = Num.cycle(rgb[1] / 255, 1)
    this.b = Num.cycle(rgb[2] / 255, 1)
  }

  get rgb255(): ColorArray3 {
    const rgb: ColorArray3 = [this.r, this.g, this.b]
    return <ColorArray3>rgb.map(v => {
      return Math.round(v * 255)
    })
  }

  set rgb(rgb: ColorArray3) {
    this.r = Num.cycle(rgb[0], 1)
    this.g = Num.cycle(rgb[1], 1)
    this.b = Num.cycle(rgb[2], 1)
  }

  get rgb(): ColorArray3 {
    return [this.r, this.g, this.b]
  }

  // RGBA

  set rgba255(rgba: ColorArray4) {
    this.r = Num.cycle(rgba[0], 1)
    this.g = Num.cycle(rgba[1], 1)
    this.b = Num.cycle(rgba[2], 1)
    this.a = Num.cycle(rgba[3], 1)
  }

  get rgba255(): ColorArray4 {
    return [this.r, this.g, this.b, this.a]
  }

  set rgba(rgba: ColorArray4) {
    this.r = Num.cycle(rgba[0], 1)
    this.g = Num.cycle(rgba[1], 1)
    this.b = Num.cycle(rgba[2], 1)
    this.a = Num.cycle(rgba[3], 1)
  }

  get rgba(): ColorArray4 {
    return [this.r, this.g, this.b, this.a]
  }

  // HSL

  set hsl(hsl: ColorArray3) {
    const rgb: ColorArray3 = ConvertColor.HSLToRGB(hsl)
    this.r = rgb[0]
    this.g = rgb[1]
    this.b = rgb[2]
  }

  get hsl(): ColorArray3 {
    return ConvertColor.RGBToHSL([this.r, this.g, this.b])
  }

  // HSV and HSB

  set hsv(hsv: ColorArray3) {
    if (hsv.length === 3) {
      const rgb: ColorArray3 = ConvertColor.HSVToRGB(hsv)
      this.r = rgb[0]
      this.g = rgb[1]
      this.b = rgb[2]
    }
  }

  get hsv(): ColorArray3 {
    return ConvertColor.HSVToRGB([this.r, this.g, this.b])
  }

  // CMYK

  set cmyk(cmyk: ColorArray4) {
    const rgb: ColorArray3 = ConvertColor.CMYKToRGB(cmyk)
    this.r = rgb[0]
    this.g = rgb[1]
    this.b = rgb[2]
  }

  get cmyk(): ColorArray4 {
    return ConvertColor.RGBToCMYK([this.r, this.g, this.b])
  }

  // RED

  set red255(red: number) {
    this.r = Num.cycle(red / 255, 1)
  }

  get red255(): number {
    return Math.round(this.r * 255)
  }

  set red(red: number) {
    this.r = red
  }

  get red(): number {
    return this.r
  }

  // GREEN

  set green255(green: number) {
    this.g = Num.cycle(green / 255, 1)
  }

  get green255(): number {
    return Math.round(this.g * 255)
  }

  set green(green: number) {
    this.g = green
  }

  get green(): number {
    return this.g
  }

  // BLUE

  set blue255(blue: number) {
    this.b = Num.cycle(blue / 255, 1)
  }

  get blue255(): number {
    return Math.round(this.b * 255)
  }

  set blue(blue: number) {
    this.b = blue
  }

  get blue(): number {
    return this.b
  }

  // CYAN

  set cyan(cyan: number) {
    const cmyk: ColorArray4 = ConvertColor.RGBToCMYK(
      [this.r, this.g, this.b]
    )
    cmyk[0] = cyan
    const rgb: ColorArray3 = ConvertColor.CMYKToRGB(cmyk)
    this.r = rgb[0]
    this.g = rgb[1]
    this.b = rgb[2]
  }

  get cyan(): number {
    return ConvertColor.RGBToCMYK([this.r, this.g, this.b])[0]
  }

  // MAGENTA

  set magenta(magenta: number) {
    const cmyk: ColorArray4 = ConvertColor.RGBToCMYK(
      [this.r, this.g, this.b]
    )
    cmyk[1] = magenta
    const rgb: ColorArray3 = ConvertColor.CMYKToRGB(cmyk)
    this.r = rgb[0]
    this.g = rgb[1]
    this.b = rgb[2]
  }

  get magenta(): number {
    return ConvertColor.RGBToCMYK(
      [this.r, this.g, this.b]
    )[1]
  }

  // YELLOW

  set yellow(yellow: number) {
    const cmyk: ColorArray4 = ConvertColor.RGBToCMYK(
      [this.r, this.g, this.b]
    )
    cmyk[2] = yellow
    const rgb: ColorArray3 = ConvertColor.CMYKToRGB(cmyk)
    this.r = rgb[0]
    this.g = rgb[1]
    this.b = rgb[2]
  }

  get yellow(): number {
    return ConvertColor.RGBToCMYK(
      [this.r, this.g, this.b]
    )[2]
  }

  // ALPHA

  set alpha(alpha: number) {
    this.a = Num.cycle(alpha, 1)
  }

  get alpha(): number {
    return this.a
  }

  // HUE

  set hue(degrees: number) {
    const hsl: ColorArray3 = ConvertColor.RGBToHSL(
      [this.r, this.g, this.b]
    )
    hsl[0] = Math.abs(Math.round(Num.cycle(degrees, 359)))
    const rgb: ColorArray3 = ConvertColor.HSLToRGB(hsl)
    this.r = rgb[0]
    this.g = rgb[1]
    this.b = rgb[2]
  }

  get hue(): number {
    const hsl: ColorArray3 = ConvertColor.RGBToHSL(
      [this.r, this.g, this.b]
    )
    return Math.round(hsl[0])
  }

  // SATURATION

  set saturation(saturation: number) {
    const hsl: ColorArray3 = ConvertColor.RGBToHSL(
      [this.r, this.g, this.b]
    )
    hsl[1] = Num.cycle(saturation, 1)
    const rgb: ColorArray3 = ConvertColor.HSLToRGB(hsl)
    this.r = rgb[0]
    this.g = rgb[1]
    this.b = rgb[2]
  }

  get saturation(): number {
    const hsl: ColorArray3 = ConvertColor.RGBToHSL(
      [this.r, this.g, this.b]
    )
    return hsl[1]
  }

  // VALUE

  set value(value: number) {
    const hsv: ColorArray3 = ConvertColor.RGBToHSV(
      [this.r, this.g, this.b]
    )
    hsv[2] = Num.cycle(value, 1)
    const rgb: ColorArray3 = ConvertColor.HSVToRGB(hsv)
    this.r = rgb[0]
    this.g = rgb[1]
    this.b = rgb[2]
  }

  get value(): number {
    const hsv: ColorArray3 = ConvertColor.RGBToHSV(
      [this.r, this.g, this.b]
    )
    return hsv[2]
  }

  get brightness(): number {
    return Math.sqrt(
      0.299 * this.r * this.r +
      0.587 * this.g * this.g +
      0.114 * this.b * this.b
    )
  }

  // MODIFIER

  hueRotate(increment: number): Color {
    this.hue = this.hue + increment
    return this
  }

  invert(): Color {
    this.r = 1 - this.r
    this.g = 1 - this.g
    this.b = 1 - this.b
    return this
  }

  // INTERPOLATION

  lerp(target: Color, t: number): Color {
    this.r = Num.lerp(this.r, target.r, t)
    this.g = Num.lerp(this.g, target.g, t)
    this.b = Num.lerp(this.b, target.b, t)
    this.a = Num.lerp(this.a, target.a, t)
    return this
  }

  // STATIC

  static isColor(color: Color): boolean {
    return color instanceof Color
  }

  static equals(color: Color): Color {
    return new Color(color)
  }

  static triadic(color: Color): [Color, Color, Color] {
    let color_a = color.clone.hueRotate(-120)
    let color_c = color.clone.hueRotate(120)
    return [color_a, color, color_c]
  }

  static complement(color: Color): Color {
    return color.clone.hueRotate(180)
  }

  static splitComplements(color: Color): [Color, Color, Color] {
    let color_a: Color = color.clone.hueRotate(-150)
    let color_c: Color = color.clone.hueRotate(150)
    return [color_a, color, color_c]
  }

  static analogous(color: Color): [Color, Color, Color] {
    let color_a: Color = color.clone.hueRotate(-30)
    let color_c: Color = color.clone.hueRotate(30)
    return [color_a, color, color_c]
  }

  static lerp(color_a: Color, color_b: Color, t: number): Color {
    let color: Color = Color.equals(color_a)
    color.r = Num.lerp(color_a.r, color_b.r, t)
    color.g = Num.lerp(color_a.g, color_b.g, t)
    color.b = Num.lerp(color_a.b, color_b.b, t)
    color.a = Num.lerp(color_a.a, color_b.a, t)
    return color
  }

}