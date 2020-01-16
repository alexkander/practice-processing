var SIZE_SCREEN = 800;
var ESCALE = 1;
var G = 0.0001;
var TRAZOLEN = 25;
var SHOW_TRAZO = true;
var PAUSED = false;
var systemIdx = 1;

var ORIGEN_X = SIZE_SCREEN / 2;
var ORIGEN_Y = SIZE_SCREEN / 2;
var origenX = ORIGEN_X;
var origenY = ORIGEN_Y;

var particulas = [];

var uniones = [];

function randn_bm(min, max, skew) {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
}

class Particula {
  color = 'white';
  diametro = 1;
  masa = 1;
  posicion = createVector(0,0);
  velocidad = createVector(0, 0);
  aceleracion = createVector(0, 0);
  trazo = [];
  
  constructor(color, diametro, masa, postAngulo, postMag, velAngulo, velMag){
    this.cant = 1;
    this.color = color;
    this.diametro = diametro;
    this.masa = masa;
    this.posicion.x = cos(postAngulo);
    this.posicion.y = sin(postAngulo);
    this.velocidad.normalize();
    this.posicion.mult(postMag);
    this.velocidad.x = cos(velAngulo);
    this.velocidad.y = sin(velAngulo);
    this.velocidad.normalize();
    this.velocidad.mult(velMag);
  }

  draw(i) {
    noStroke();
    fill(this.color);
    var shape = this.posicion.copy().mult(ESCALE).add(origenX, origenY);
    ellipse(shape.x, shape.y, ESCALE * this.diametro, ESCALE * this.diametro);
    if (!SHOW_TRAZO) return;
    for(var j=0; j<this.trazo.length; j++){
      var trazo = this.trazo[this.trazo.length-j-1];
      var p = trazo.copy().mult(ESCALE).add(origenX, origenY);
      fill(this.color);
      ellipse(p.x, p.y, 1, 1);
      // text(p.toString(), 10, 15 + j * 15);
    }
    // text("m:" + shape.toString() + (p ? p.toString() : '' ), 10, 15 + i * 15);
    // text("m:" + this.masa, 10, 15 + i * 15);
    // text("x:" + this.posicion.x, 90, 15 + i * 15);
    // text("y:" + this.posicion.y, 170, 15 + i * 15);
    // text("vx:" + this.velocidad.x, 250, 15 + i * 15);
    // text("vy:" + this.velocidad.y, 330, 15 + i * 15);
    // text("ax:" + this.aceleracion.x, 410, 15 + i * 15);
    // text("ay:" + this.aceleracion.y, 490, 15 + i * 15);
  }

  actualizar() {
    this.velocidad.add(this.aceleracion);
    this.posicion.add(this.velocidad);
    //this.aceleracion.mult(0);
    if (!SHOW_TRAZO) return;
    this.trazo.push(this.posicion.copy());
    if (this.trazo.length>TRAZOLEN){
      this.trazo.shift();
    }
  }

  aplicarFuerza(fuerza){
    var fuerzaResultante =  p5.Vector.div(fuerza, this.masa);
    this.aceleracion.add(fuerzaResultante);
  }

  aplicarGravedadParticula(p){
    var direccion =  p5.Vector.sub(p.posicion, this.posicion);
    var distancia = direccion.mag();
    distancia = constrain(distancia, 5, 25);
    var magnitud = (G * this.masa * p.masa) / (distancia * distancia);
    direccion.normalize();
    direccion.mult(magnitud);
    this.aplicarFuerza(direccion);
  }

  chequearBordes(){
    // Check for bouncing.
    if (this.posicion.x > width) {
      this.posicion.x = width;
      this.velocidad.x *= -1;
    } else if(this.posicion.x < 0){
      this.posicion.x = 0;
      this.velocidad.x *= -1;
    }
    if (this.posicion.y > height) {
      this.posicion.y = width;
      this.velocidad.y *= -1;
    } else if(this.posicion.y < 0){
      this.posicion.y = 0;
      this.velocidad.y *= -1;
    }
  }

}

function actualizarParticulas() {
  for (var i = 0; i < particulas.length; ++i) {
    particulas[i].aceleracion.mult(0);
    for (var j = 0; j < particulas.length; ++j) {
      if (i!=j){
        particulas[i].aplicarGravedadParticula(particulas[j]);
      }
    }
    particulas[i].actualizar();
  }
}

function verificarUnionDeParticulas() {
  for (var i = 0; i < particulas.length; ++i) {
    if (!particulas[i]) continue;
    for (var j = 0; j < particulas.length; ++j) {
      if (i!=j){
        if (!particulas[j]) continue;
        const dist = particulas[i].posicion.dist(particulas[j].posicion);
        if (dist<0.5){
          // PAUSED = true;
          // var colores = ['brown', 'red', '#00ff00', 'cyan'];
          uniones.push({
            i: particulas[i].posicion.copy(),
            j: particulas[j].posicion.copy(),
            k: particulas[i].posicion.copy().add(particulas[j].posicion).div(2)
          });
          particulas[i].cant += particulas[j].cant;
          var grayMap = map(particulas[i].cant, 2, 50, 100, 255);
          var gray = Math.round(grayMap).toString(16);
          gray = gray.length>1? gray : '0'+gray;
          console.log(particulas[i].cant, grayMap, gray);
          particulas[i].color = '#'+gray+gray+gray;
          particulas[i].masa += particulas[j].masa;
          particulas[i].posicion.add(particulas[j].posicion).div(2);
          particulas[i].velocidad.add(particulas[j].velocidad).div(2);
          particulas[j] = null;
        }
      }
    }
    particulas[i].actualizar();
  }
  particulas = particulas.filter(p => p);
}

function drawParticulas(){
  var eje = createVector(0, 0);
  for (var i = 0; i < particulas.length; ++i) {
    eje.add(particulas[i].posicion);
  }
  eje.div(i);
  
  origenX = ORIGEN_X - eje.x * ESCALE;
  origenY = ORIGEN_Y - eje.y * ESCALE;
  
  for (var i = 0; i < particulas.length; ++i) {
    // particulas[i].chequearBordes();
    particulas[i].draw(i);
  }
}

function drawEjes(){
  stroke(25,25,25);
  line(SIZE_SCREEN/2, 0, SIZE_SCREEN/2, SIZE_SCREEN);
  line(0, SIZE_SCREEN/2, SIZE_SCREEN, SIZE_SCREEN/2);
  
  // stroke(50,50,50);
  // line(origenX, 0, origenX, SIZE_SCREEN);
  // line(0,origenY,SIZE_SCREEN,origenY);
}

function drawUniones() {
  for (let i = 0; i < uniones.length; i++) {
    const union = uniones[i];
    stroke(0, 255, 0);
    var shapei = union.i.copy().mult(ESCALE).add(origenX, origenY);
    var shapek = union.k.copy().mult(ESCALE).add(origenX, origenY);
    line(shapei.x, shapei.y, shapek.x, shapek.y);
  }
}

function drawSistema(){
  background(0,0,0);
  drawParticulas();
  drawEjes();
  drawUniones();
}

function init_1_sistemaSolar(){
  G = 0.0001;
  TRAZOLEN = 1000;
  SHOW_TRAZO = true;

  particulas.length = 5;
  particulas = [];
  var mover = 0;
  var MUL_DIST = 4;
  var MUL_VEL = 2;
  var sol = new Particula('green', 40, 500000, 0, 0, 0, 0);
  sol.posicion.add(mover, mover); particulas.push(sol);
  // var sol1 = new Particula('green', 25, 300000, 1.5708*0, 40, 1.5708*3, 1);
  // sol1.posicion.add(mover, mover); particulas.push(sol1);
  // var sol2 = new Particula('green', 15, 200000, 1.5708*2, 40, 1.5708*1, 1);
  // sol2.posicion.add(mover, mover); particulas.push(sol2);
  var mercurio = new Particula('purple', 2, 80, 1.5708*0, 80*MUL_DIST, 1.5708*3, 2.5*MUL_VEL);
  mercurio.posicion.add(mover, mover); particulas.push(mercurio);
  var venus = new Particula('blue', 4, 100, 1.5708*2, 120*MUL_DIST, 1.5708*1, 3*MUL_VEL);
  venus.posicion.add(mover, mover); particulas.push(venus);
  var tierra = new Particula('cyan', 10, 160, 1.5708*3, 300*MUL_DIST, 1.5708*2, 5*MUL_VEL);
  tierra.posicion.add(mover, mover); particulas.push(tierra);
  var marte = new Particula('orange', 8, 130, 1.5708*1, 380*MUL_DIST, 1.5708*0, 5*MUL_VEL);
  marte.posicion.add(mover, mover); particulas.push(marte);
  
}

function init_2_particulas(){
  G = 0.015;
  TRAZOLEN = 0;
  SHOW_TRAZO = false;

  var cant = 500;
  particulas = [
    // new Particula('blue', 100, 5000, 0, 0, 0, 0)
  ];
  var mover = 0;
  for (var i = 0; i < cant; ++i) {
    var masa = random(1, 10);
    var posAngulo = random(0, 1.5708*4);
    var posMag = random(0, SIZE_SCREEN);
    var velAngulo = posAngulo - 1.5708 + random(-1.5708/4, 1.5708/4);
    var velMag = map(posMag, 0, SIZE_SCREEN, 0, 6);
    var p = new Particula('#323232', masa, masa, posAngulo, posMag, velAngulo, velMag);
    p.posicion.add(mover, mover);
    particulas.push(p);
  }
}

var sistemas = [init_1_sistemaSolar, init_2_particulas];

function initSistema(){
  uniones = [];
  sistemas[systemIdx]();
  drawSistema();
}

function setup() {
  createCanvas(800, 800);
  initSistema();
}

function draw() {
  if (PAUSED) return;
  actualizarParticulas();
  verificarUnionDeParticulas();
  drawSistema();
}

function keyPressed() {
  if (key == '+') {
    ESCALE *= 2;
  } else if (key == '-') {
    ESCALE /= 2;
  } else if (keyCode == 37) { // left
    origenX -=10; 
  } else if (keyCode == 39) { // right
    origenX +=10;
  } else if (keyCode == 38) { // up
    origenY -=10; 
  } else if (keyCode == 40) { // down
    origenY +=10;
  } else if (key == 'p') { // p
    PAUSED = !PAUSED;
  } else if (key == 'r') { // r
    initSistema();
  } else if (key == 't') { // t
    SHOW_TRAZO = !SHOW_TRAZO;
  } else if (key == '1') { // 1
    systemIdx = 0;
    initSistema();
  } else if (key == '2') { // @
    systemIdx = 1;
    initSistema();
  }
  drawSistema();
}
