const G = 1;
const intervalo = 1;
const m1 = 10, x1=70, y1 = 130;
const m2 = 20, x2=650, y2 = 910;
const m3 = 100, x3=500, y3 = 500;

// const angulo1;
// const angulo2;
// cos(angulo1) = x1 - x2;
// sen(angulo1) = y1 - y2;
// cos(angulo2) = x1 - x3;
// sen(angulo2) = y1 - y3;;

const r12 = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
const F12 = G * (m1 * m2) / Math.pow(r12, 2);

const r13 = Math.sqrt(Math.pow(x1 - x3, 2) + Math.pow(y1 - y3, 2));
const F13 = G * (m1 * m3) / Math.pow(r13, 2);

const vF12 = [F12 * (x1 - x2), F12 * (y1 - y2)];
const vF13 = [F13 * (x1 - x3), F13 * (y1 - y3)];

const vF1x = F12 * (x1 - x2) + F13 * (x1 - x3);
const vF1y = F12 * (y1 - y2) + F13 * (y1 - y3);

const nx1 = x1 + intervalo * vF1x;
const ny1 = y1 + intervalo * vF1y;

console.log('nx1', nx1);
console.log('ny1', ny1);