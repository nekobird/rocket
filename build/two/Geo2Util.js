import { Vector2, } from '../Rocket';
export class Geo2Util {
    static getSlopeOfLine(ls, le) {
        if (le.x === ls.x) {
            return false;
        }
        else {
            let rise = le.y - ls.y;
            let run = le.x - ls.x;
            return rise / run;
        }
    }
    static checkIfTwoLineSegmentsAreParallel(ls1, le1, ls2, le2) {
        let s1 = Geo2Util.getSlopeOfLine(ls1, le1);
        let s2 = Geo2Util.getSlopeOfLine(ls2, le2);
        return s1 === s2 ? true : false;
    }
    static checkIfTwoLineSegmentsIntersect(ls1, le1, ls2, le2) {
        let pi = Geo2Util.getPointOfIntersectionBetweenTwoLineSegments(ls1, le1, ls2, le2);
        if (pi === false) {
            return false;
        }
        if (pi.x > Math.max(ls1.x, le1.x) ||
            pi.x < Math.min(ls1.x, le1.x) ||
            pi.x > Math.max(ls2.x, le2.x) ||
            pi.x < Math.min(ls2.x, le2.x) ||
            pi.y > Math.max(ls1.y, le1.y) ||
            pi.y < Math.min(ls1.y, le1.y) ||
            pi.y > Math.max(ls2.y, le2.y) ||
            pi.y < Math.min(ls2.y, le2.y)) {
            return false;
        }
        else {
            return true;
        }
    }
    static getPointOfIntersectionBetweenTwoLineSegments(ls1, le1, ls2, le2) {
        if (Geo2Util.checkIfTwoLineSegmentsAreParallel(ls1, le1, ls2, le2) === true) {
            return false;
        }
        let ix = 0;
        let iy = 0;
        let m1 = Geo2Util.getSlopeOfLine(ls1, le1);
        let m2 = Geo2Util.getSlopeOfLine(ls2, le2);
        let yi1;
        let yi2;
        if (m1 === false &&
            typeof m2 === 'number') {
            ix = ls1.x;
            yi2 = -1 * m2 * ls2.x + ls2.y;
            iy = m2 * ix + yi2;
        }
        else if (m2 === false &&
            typeof m1 === 'number') {
            ix = ls2.x;
            yi1 = -1 * m1 * ls1.x + ls1.y;
            iy = m1 * ix + yi1;
        }
        else if (typeof m1 === 'number' &&
            typeof m2 === 'number') {
            yi1 = -1 * m1 * ls1.x + ls1.y;
            yi2 = -1 * m2 * ls2.x + ls2.y;
            ix = (yi1 - yi2) / (m2 - m1);
            iy = m1 * ix + yi1;
        }
        return new Vector2(ix, iy);
    }
}
//# sourceMappingURL=Geo2Util.js.map