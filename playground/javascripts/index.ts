import * as Rocket from '../../rocket/rocket';

// @ts-ignore
window.Rocket = Rocket;

let a = [1];
Rocket.Util.fillArraysToLargestLength(0, a, [1]);

console.log(a);

Rocket.Util.fillArraysToLargestLength(0, a, [1,2,3]);

console.log(a);

Rocket.Util.fillArraysToLargestLength(0, a, [1,2,3, 4, 5]);

console.log(a);