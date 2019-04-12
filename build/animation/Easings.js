export class Easings {
    static QuadEaseIn(t) {
        return t * t;
    }
    static QuadEaseOut(t) {
        return -1 * t * (t - 2);
    }
    static QuadEaseInEaseOut(t) {
        t /= 0.5;
        if (t < 1) {
            return 0.5 * t * t;
        }
        t--;
        return -0.5 * (t * (t - 2) - 1);
    }
    static CubicEaseIn(t) {
        return t * t * t;
    }
    static CubicEaseOut(t) {
        t--;
        return t * t * t + 1;
    }
    static CubicEaseInEaseOut(t) {
        t /= 0.5;
        if (t < 1) {
            return 0.5 * t * t * t;
        }
        t -= 2;
        return 0.5 * (t * t * t + 2);
    }
    static QuarticEaseIn(t) {
        return t * t * t * t;
    }
    static QuarticEaseOut(t) {
        t--;
        return -1 * (t * t * t * t - 1);
    }
    static QuarticEaseInEaseOut(t) {
        t /= 0.5;
        if (t < 1) {
            return 0.5 * t * t * t * t;
        }
        t -= 2;
        return -0.5 * (t * t * t * t - 2);
    }
    static EaseOutElastic(t, p = 0.3) {
        return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    }
}
//# sourceMappingURL=Easings.js.map