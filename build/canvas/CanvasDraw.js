import { Color, Vector2, } from '../Rocket';
const DEFAULT_STYLE = {
    fillColor: 'black',
    noFill: false,
    noStroke: false,
    strokeCap: 'round',
    strokeColor: 'black',
    strokeJoin: 'round',
    strokeWidth: 0
};
export class CanvasDraw {
    constructor(element) {
        this.element = element;
        this.context = this.element.getContext('2d');
        this.resolutionMultiplier = window.devicePixelRatio;
        this.previousTranslation = new Vector2;
        this._defaultStyle = Object.assign({}, DEFAULT_STYLE);
        this.resize();
    }
    get defaultStyle() {
        return this._defaultStyle;
    }
    set defaultStyle(style) {
        if (typeof style === 'object') {
            Object.assign(this._defaultStyle, style);
        }
    }
    createLinearGradient(from, to) {
        let m = this.resolutionMultiplier;
        return this.context.createLinearGradient(from.x * m, from.y * m, to.x * m, to.y * m);
    }
    createRadialGradient(from, fromRadius, to, toRadius) {
        let m = this.resolutionMultiplier;
        return this.context.createRadialGradient(from.x * m, from.y * m, fromRadius * m, to.x * m, to.y * m, toRadius * m);
    }
    applyStyle(style) {
        let computedStyle = Object.assign({}, this._defaultStyle);
        if (typeof style === 'object') {
            Object.assign(computedStyle, style);
        }
        this.context.fillStyle = computedStyle.fillColor;
        this.context.lineCap = computedStyle.strokeCap;
        this.context.lineJoin = computedStyle.strokeJoin;
        this.context.strokeStyle = computedStyle.strokeColor;
        this.context.lineWidth = computedStyle.strokeWidth;
        if (computedStyle.noFill === false) {
            this.context.fill();
        }
        if (computedStyle.noStroke === false) {
            this.context.stroke();
        }
        return this;
    }
    clear() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
        return this;
    }
    resize(width, height) {
        const m = this.resolutionMultiplier;
        if (typeof height === 'number' &&
            typeof width === 'number') {
            this.element.height = height * m;
            this.element.width = width * m;
        }
        else {
            this.element.height = this.element.offsetHeight * m;
            this.element.width = this.element.offsetWidth * m;
        }
        return this;
    }
    getPixelColor(point) {
        let m = this.resolutionMultiplier;
        let imageData = this.context.getImageData(point.x * m, point.y * m, this.element.width, this.element.height);
        let data = imageData.data;
        let color = new Color();
        color.r = data[0] / 255;
        color.g = data[1] / 255;
        color.b = data[2] / 255;
        color.a = data[3] / 255;
        return color;
    }
    putPixelColor(point, color) {
        let m = this.resolutionMultiplier;
        let pixel = this.context.getImageData(point.x * m, point.y * m, 1, 1);
        let data = pixel.data;
        data[0] = color.r * 255;
        data[1] = color.g * 255;
        data[2] = color.b * 255;
        data[3] = color.a * 255;
        return this.context.putImageData(pixel, 0, 0);
    }
    clip() {
        this.context.clip();
        return this;
    }
    shadow(offsetX, offsetY, blur, color) {
        let m = this.resolutionMultiplier;
        if (color instanceof Color) {
            color = color.rgbaString;
        }
        this.context.shadowBlur = blur * m;
        this.context.shadowColor = color;
        this.context.shadowOffsetX = offsetX * m;
        this.context.shadowOffsetY = offsetY * m;
        return this;
    }
    image(img, st, sw, sh, dt, dw, dh) {
        let m = this.resolutionMultiplier;
        this.context.drawImage(img, st.x, st.y, sw, sh, dt.x * m, dt.y * m, dw * m, dh * m);
        return this;
    }
    circle(v, r, style, insert) {
        let m = this.resolutionMultiplier;
        this.save();
        this.begin();
        this.context.arc(v.x * m, v.y * m, r * m, 0, 2 * Math.PI, false);
        this.end();
        this.applyStyle(style);
        if (typeof insert !== 'undefined') {
            insert();
        }
        this.restore();
        return this;
    }
    begin() {
        this.context.beginPath();
        return this;
    }
    end() {
        this.context.closePath();
        return this;
    }
    isPointInPath(point) {
        let m = this.resolutionMultiplier;
        this.context.isPointInPath(point.x * m, point.y * m);
        return this;
    }
    moveTo(to) {
        let m = this.resolutionMultiplier;
        this.context.moveTo(to.x * m, to.y * m);
        return this;
    }
    lineTo(to) {
        let m = this.resolutionMultiplier;
        this.context.lineTo(to.x * m, to.y * m);
        return this;
    }
    arcTo(from, to, r) {
        let m = this.resolutionMultiplier;
        this.context.arcTo(from.x * m, from.y * m, to.x * m, to.y * m, r * m);
        return this;
    }
    bezierCurveTo(cp1, cp2, to) {
        let m = this.resolutionMultiplier;
        this.context.bezierCurveTo(cp1.x * m, cp1.y * m, cp2.x * m, cp2.y * m, to.x * m, to.y * m);
        return this;
    }
    quadraticCurveTo(cp, to) {
        let m = this.resolutionMultiplier;
        this.context.quadraticCurveTo(cp.x * m, cp.y * m, to.x * m, to.y * m);
        return this;
    }
    translate(to) {
        let m = this.resolutionMultiplier;
        this.context.translate(to.x * m, to.y * m);
        this.previousTranslation.equals(to);
        return this;
    }
    rotate(angle) {
        this.context.rotate(angle);
        return this;
    }
    scale(w, h) {
        if (typeof h !== 'number') {
            h = w;
        }
        this.context.scale(w, h);
        return this;
    }
    reset() {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        return this;
    }
    save() {
        this.context.save();
        return this;
    }
    restore() {
        this.context.restore();
        return this;
    }
}
//# sourceMappingURL=CanvasDraw.js.map