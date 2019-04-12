import { Num, Util, ConvertColor } from '../Rocket';
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
    constructor(input) {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 1;
        if (typeof input !== 'undefined') {
            this.set(input);
        }
        return this;
    }
    equals(color) {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
        return this;
    }
    get clone() {
        return Color.equals(this);
    }
    set(input) {
        if (Color.isColor(input)) {
            this.equals(input);
        }
        else if (typeof input === 'string') {
            this.colorString = input;
        }
        else {
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.a = 1;
        }
        return this;
    }
    set colorString(input) {
        if (typeof NAMED_COLOR_SET[input] !== 'undefined') {
            this.rgba = NAMED_COLOR_SET[input];
        }
        else if (typeof Util.match(input, COLOR_INPUT_REGEX.hex) === 'string') {
            this.hex = input;
        }
        else if (typeof Util.match(input, COLOR_INPUT_REGEX.rgb) === 'string') {
            this.rgbString = input;
        }
        else if (typeof Util.match(input, COLOR_INPUT_REGEX.rgba) === 'string') {
            this.rgbaString = input;
        }
        else if (typeof Util.match(input, COLOR_INPUT_REGEX.hsl) === 'string') {
            this.hslString = input;
        }
        else if (typeof Util.match(input, COLOR_INPUT_REGEX.hsla) === 'string') {
            this.hslaString = input;
        }
    }
    set rgbString(input) {
        let rgb = input.match(/(\d+)/g).map(v => {
            return Num.cycle(parseFloat(v) / 255, 1);
        });
        this.r = rgb[0];
        this.g = rgb[1];
        this.b = rgb[2];
    }
    set rgbaString(input) {
        let rgba = input.match(/([\d]+(\.[\d]+)?)/g).map((v, index) => {
            if (index === 3) {
                return Num.cycle(parseFloat(v), 1);
            }
            else {
                return Num.cycle(parseFloat(v) / 255, 1);
            }
        });
        this.r = rgba[0];
        this.g = rgba[1];
        this.b = rgba[2];
        this.a = rgba[3];
    }
    set hslString(input) {
        let hsl = input.match(/(\d+)/g).map(v => {
            return parseFloat(v);
        });
        hsl[1] = hsl[1] / 100, 1;
        hsl[2] = hsl[2] / 100, 1;
        const rgb = ConvertColor.HSLToRGB(hsl);
        this.r = rgb[0];
        this.g = rgb[1];
        this.b = rgb[2];
    }
    set hslaString(input) {
        let hsla = input.match(/([\d]+(\.[\d]+)?)/g).map(v => {
            return parseFloat(v);
        });
        let hsl = hsla.slice(0, 3);
        hsl[1] = hsl[1] / 100;
        hsl[2] = hsl[2] / 100;
        const rgb = ConvertColor.HSLToRGB(hsl);
        this.r = rgb[0];
        this.g = rgb[1];
        this.b = rgb[2];
        this.a = Num.cycle(hsla[3], 1);
    }
    get rgbString() {
        const rgb = this.rgb255;
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
    get rgbaString() {
        let rgba = this.rgb255;
        return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${this.a})`;
    }
    get hslString() {
        let hsl = this.hsl;
        const s = (hsl[1] * 100).toFixed(0);
        const l = (hsl[2] * 100).toFixed(0);
        return `hsl(${hsl[0]}, %${s}, ${l})`;
    }
    get hslaString() {
        let hsl = this.hsl;
        const s = (hsl[1] * 100).toFixed(0);
        const l = (hsl[2] * 100).toFixed(0);
        return `hsl(${hsl[0]}, %${s}, ${l}, ${this.a})`;
    }
    set hexString(hex) {
        this.hex = hex;
    }
    get hexString() {
        return this.hex;
    }
    set hex(hex) {
        let rgb = ConvertColor.HEXToRGB(hex);
        this.r = rgb[0];
        this.g = rgb[1];
        this.b = rgb[2];
    }
    get hex() {
        let rgb = [this.r, this.g, this.b];
        return ConvertColor.RGBToHEX(rgb);
    }
    set rgb255(rgb) {
        this.r = Num.cycle(rgb[0] / 255, 1);
        this.g = Num.cycle(rgb[1] / 255, 1);
        this.b = Num.cycle(rgb[2] / 255, 1);
    }
    get rgb255() {
        const rgb = [this.r, this.g, this.b];
        return rgb.map(v => {
            return Math.round(v * 255);
        });
    }
    set rgb(rgb) {
        this.r = Num.cycle(rgb[0], 1);
        this.g = Num.cycle(rgb[1], 1);
        this.b = Num.cycle(rgb[2], 1);
    }
    get rgb() {
        return [this.r, this.g, this.b];
    }
    set rgba255(rgba) {
        this.r = Num.cycle(rgba[0], 1);
        this.g = Num.cycle(rgba[1], 1);
        this.b = Num.cycle(rgba[2], 1);
        this.a = Num.cycle(rgba[3], 1);
    }
    get rgba255() {
        return [this.r, this.g, this.b, this.a];
    }
    set rgba(rgba) {
        this.r = Num.cycle(rgba[0], 1);
        this.g = Num.cycle(rgba[1], 1);
        this.b = Num.cycle(rgba[2], 1);
        this.a = Num.cycle(rgba[3], 1);
    }
    get rgba() {
        return [this.r, this.g, this.b, this.a];
    }
    set hsl(hsl) {
        const rgb = ConvertColor.HSLToRGB(hsl);
        this.r = rgb[0];
        this.g = rgb[1];
        this.b = rgb[2];
    }
    get hsl() {
        return ConvertColor.RGBToHSL([this.r, this.g, this.b]);
    }
    set hsv(hsv) {
        if (hsv.length === 3) {
            const rgb = ConvertColor.HSVToRGB(hsv);
            this.r = rgb[0];
            this.g = rgb[1];
            this.b = rgb[2];
        }
    }
    get hsv() {
        return ConvertColor.HSVToRGB([this.r, this.g, this.b]);
    }
    set cmyk(cmyk) {
        const rgb = ConvertColor.CMYKToRGB(cmyk);
        this.r = rgb[0];
        this.g = rgb[1];
        this.b = rgb[2];
    }
    get cmyk() {
        return ConvertColor.RGBToCMYK([this.r, this.g, this.b]);
    }
    set red255(red) {
        this.r = Num.cycle(red / 255, 1);
    }
    get red255() {
        return Math.round(this.r * 255);
    }
    set red(red) {
        this.r = red;
    }
    get red() {
        return this.r;
    }
    set green255(green) {
        this.g = Num.cycle(green / 255, 1);
    }
    get green255() {
        return Math.round(this.g * 255);
    }
    set green(green) {
        this.g = green;
    }
    get green() {
        return this.g;
    }
    set blue255(blue) {
        this.b = Num.cycle(blue / 255, 1);
    }
    get blue255() {
        return Math.round(this.b * 255);
    }
    set blue(blue) {
        this.b = blue;
    }
    get blue() {
        return this.b;
    }
    set cyan(cyan) {
        const cmyk = ConvertColor.RGBToCMYK([this.r, this.g, this.b]);
        cmyk[0] = cyan;
        const rgb = ConvertColor.CMYKToRGB(cmyk);
        this.r = rgb[0];
        this.g = rgb[1];
        this.b = rgb[2];
    }
    get cyan() {
        return ConvertColor.RGBToCMYK([this.r, this.g, this.b])[0];
    }
    set magenta(magenta) {
        const cmyk = ConvertColor.RGBToCMYK([this.r, this.g, this.b]);
        cmyk[1] = magenta;
        const rgb = ConvertColor.CMYKToRGB(cmyk);
        this.r = rgb[0];
        this.g = rgb[1];
        this.b = rgb[2];
    }
    get magenta() {
        return ConvertColor.RGBToCMYK([this.r, this.g, this.b])[1];
    }
    set yellow(yellow) {
        const cmyk = ConvertColor.RGBToCMYK([this.r, this.g, this.b]);
        cmyk[2] = yellow;
        const rgb = ConvertColor.CMYKToRGB(cmyk);
        this.r = rgb[0];
        this.g = rgb[1];
        this.b = rgb[2];
    }
    get yellow() {
        return ConvertColor.RGBToCMYK([this.r, this.g, this.b])[2];
    }
    set alpha(alpha) {
        this.a = Num.cycle(alpha, 1);
    }
    get alpha() {
        return this.a;
    }
    set hue(degrees) {
        const hsl = ConvertColor.RGBToHSL([this.r, this.g, this.b]);
        hsl[0] = Math.abs(Math.round(Num.cycle(degrees, 359)));
        const rgb = ConvertColor.HSLToRGB(hsl);
        this.r = rgb[0];
        this.g = rgb[1];
        this.b = rgb[2];
    }
    get hue() {
        let hsl = ConvertColor.RGBToHSL([this.r, this.g, this.b]);
        return Math.round(hsl[0]);
    }
    set saturation(saturation) {
        let hsl = ConvertColor.RGBToHSL([this.r, this.g, this.b]);
        hsl[1] = Num.cycle(saturation, 1);
        let rgb = ConvertColor.HSLToRGB(hsl);
        this.r = rgb[0];
        this.g = rgb[1];
        this.b = rgb[2];
    }
    get saturation() {
        let hsl = ConvertColor.RGBToHSL([this.r, this.g, this.b]);
        return hsl[1];
    }
    set value(value) {
        let hsv = ConvertColor.RGBToHSV([this.r, this.g, this.b]);
        if (typeof value === 'number') {
            value = Num.cycle(value, 1);
            hsv[2] = value;
            let rgb = ConvertColor.HSVToRGB(hsv);
            this.r = rgb[0];
            this.g = rgb[1];
            this.b = rgb[2];
        }
    }
    get value() {
        let hsv = ConvertColor.RGBToHSV([this.r, this.g, this.b]);
        return hsv[2];
    }
    get brightness() {
        return Math.sqrt(0.299 * this.r * this.r +
            0.587 * this.g * this.g +
            0.114 * this.b * this.b);
    }
    hueRotate(increment) {
        this.hue = this.hue + increment;
        return this;
    }
    invert() {
        this.r = 1 - this.r;
        this.g = 1 - this.g;
        this.b = 1 - this.b;
        return this;
    }
    lerp(target, t) {
        this.r = Num.lerp(this.r, target.r, t);
        this.g = Num.lerp(this.g, target.g, t);
        this.b = Num.lerp(this.b, target.b, t);
        this.a = Num.lerp(this.a, target.a, t);
        return this;
    }
    static isColor(color) {
        return color instanceof Color ? true : false;
    }
    static equals(color) {
        return new Color(color);
    }
    static triadic(color) {
        let colora = color.clone.hueRotate(-120);
        let colorc = color.clone.hueRotate(120);
        return [colora, color, colorc];
    }
    static complement(color) {
        return color.clone.hueRotate(180);
    }
    static splitComplements(color) {
        let colora = color.clone.hueRotate(-150);
        let colorc = color.clone.hueRotate(150);
        return [colora, color, colorc];
    }
    static analogous(color) {
        let colora = color.clone.hueRotate(-30);
        let colorc = color.clone.hueRotate(30);
        return [colora, color, colorc];
    }
    static lerp(color1, color2, t) {
        let color = Color.equals(color1);
        color.r = Num.lerp(color1.r, color2.r, t);
        color.g = Num.lerp(color1.g, color2.g, t);
        color.b = Num.lerp(color1.b, color2.b, t);
        color.a = Num.lerp(color1.a, color2.a, t);
        return color;
    }
}
//# sourceMappingURL=Color.js.map