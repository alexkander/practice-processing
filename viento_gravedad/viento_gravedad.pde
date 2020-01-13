final int SCREEN_SIZE = 900;

float masa = 20;
PVector posicion = new PVector(random(0, SCREEN_SIZE), 0);
PVector velocidad = new PVector(0, 0);
PVector aceleracion = new PVector(0, 0);

PVector wind = new PVector(0.1, 0);
PVector gravity = new PVector(0, 1);

void aplicarFuerza(PVector fuerza){
  PVector fuerzaResultante = PVector.div(fuerza, masa);
  aceleracion.add(fuerzaResultante);
}

void actualizar() {
  velocidad.add(aceleracion);
  posicion.add(velocidad);
  aceleracion.mult(0);
}

void chequearBordes(){
  // Check for bouncing.
  if (posicion.x > width) {
    posicion.x = width;
    velocidad.x *= -1;
  } else if(posicion.x < 0){
    posicion.x = 0;
    velocidad.x *= -1;
  }
  if (posicion.y > height) {
    posicion.y = width;
    velocidad.y *= -1;
  } else if(posicion.y < 0){
    posicion.y = 0;
    velocidad.y *= -1;
  }
}

void drawParticula() {
  noStroke();
  fill(181, 181, 181);
  // Display the ball at the location (x,y).
  ellipse(posicion.x, posicion.y, masa, masa);
}

void setup() {
  size(900, 900);
}

void draw() {
  background(0,255,255);
  aplicarFuerza(wind);
  aplicarFuerza(gravity);
  actualizar();
  chequearBordes();
  drawParticula();
}
