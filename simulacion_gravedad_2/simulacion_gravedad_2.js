var SIZE_SCREEN = 900;
var G = 0.0001;

var ESCALE = 1;
var ORIGEN_X = SIZE_SCREEN / 2;
var ORIGEN_Y = SIZE_SCREEN / 2;
var PAUSED = true;

var cantParticulas;
var particulas = [];

class Particula {
  diametro = 1;
  masa = 1;
  posicion = createVector(0,0);
  velocidad = createVector(0, 0);
  aceleracion = createVector(0, 0);
  
  constructor(diametro, masa, postAngulo, postMag, velAngulo, velMag){
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
    fill(255,255,255);
    ellipse(ORIGEN_X + ESCALE * this.posicion.x, ORIGEN_Y + ESCALE * this.posicion.y, ESCALE * this.diametro, ESCALE * this.diametro);
    text("m:" + this.masa, 10, 15 + i * 15);
    text("x:" + this.posicion.x, 90, 15 + i * 15);
    text("y:" + this.posicion.y, 170, 15 + i * 15);
    text("vx:" + this.velocidad.x, 250, 15 + i * 15);
    text("vy:" + this.velocidad.y, 330, 15 + i * 15);
    text("ax:" + this.aceleracion.x, 410, 15 + i * 15);
    text("ay:" + this.aceleracion.y, 490, 15 + i * 15);
  }

  actualizar() {
    this.velocidad.add(this.aceleracion);
    this.posicion.add(this.velocidad);
    //this.aceleracion.mult(0);
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
  for (var i = 0; i < cantParticulas; ++i) {
    particulas[i].aceleracion.mult(0);
    for (var j = 0; j < cantParticulas; ++j) {
      if (i!=j){
        particulas[i].aplicarGravedadParticula(particulas[j]);
      }
    }
    particulas[i].actualizar();
  }
}

function drawParticulas(){
  for (var i = 0; i < cantParticulas; ++i) {
    // particulas[i].chequearBordes();
    particulas[i].draw(i);
  }
}

function drawEjes(){
  stroke(0,255,0);
  line(SIZE_SCREEN/2, 0, SIZE_SCREEN/2, SIZE_SCREEN);
  line(0, SIZE_SCREEN/2, SIZE_SCREEN, SIZE_SCREEN/2);
  
  //stroke(50,50,50);
  //line(ORIGEN_X, 0, ORIGEN_X, SIZE_SCREEN);
  //line(0,ORIGEN_Y,SIZE_SCREEN,ORIGEN_Y);
}

function drawSistema(){
  background(0,0,0);
  // drawEjes();
  drawParticulas();
}

function initParticulas(cant){
  cantParticulas = cant;
  particulas= [];
  // particulas = new Particula[cantParticulas];
  for (var i = 0; i < cantParticulas; ++i) {
    var masa = random(1, 20);
    var posAngulo = random(0, 360);
    var posMag = random(0, SIZE_SCREEN);
    var velAngulo = random(0, 360);
    var velMag = random(0, 1);
    particulas.push(new Particula(masa, masa, posAngulo, posMag, velAngulo, velMag));
  }
}

function initSolTierra(){
  cantParticulas = 5;
  particulas = [];
  // particulas = new Particula[cantParticulas];
  particulas.push(new Particula(40, 500000, 0, 0, 0, 0));
  particulas.push(new Particula(2, 80, -1.5708, 80, -1.5708*2, 2.5));
  particulas.push(new Particula(4, 100, 1.5708*2, 120, 1.5708, 2.5));
  particulas.push(new Particula(10, 160, 0, 300, -1.5708, 5));
  particulas.push(new Particula(8, 130, 0, -350, 1.5708, 5));
}

function setup() {
  createCanvas(900, 900);
  // initParticulas(100);
  initSolTierra();
  drawSistema();
}

function draw() {
  if (PAUSED) return;
  actualizarParticulas();
  drawSistema();
}

function keyPressed() {
  if (key == '+') {
    ESCALE *= 2;
  } else if (key == '-') {
    ESCALE /= 2;
  } else if (keyCode == 37) { // left
    ORIGEN_X -=10; 
  } else if (keyCode == 39) { // right
    ORIGEN_X +=10;
  } else if (keyCode == 38) { // up
    ORIGEN_Y -=10; 
  } else if (keyCode == 40) { // down
    ORIGEN_Y +=10;
  } else if (key == 'p') { // down
    PAUSED = !PAUSED;
  }
  drawSistema();
}
