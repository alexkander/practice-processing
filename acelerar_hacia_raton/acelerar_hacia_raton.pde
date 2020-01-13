final int SCREEN_SIZE = 900;

final float ACELERACION = 1; 

PVector posicion = new PVector(SCREEN_SIZE/2, SCREEN_SIZE/2);
PVector velocidad = new PVector(0, 0);

void actualizarParticula() {
  PVector aceleracion = new PVector(mouseX, mouseY);
  aceleracion.sub(posicion);
  aceleracion.normalize();
  aceleracion.mult(ACELERACION);
  velocidad.add(aceleracion);
  velocidad.limit(8);
  posicion.add(velocidad);
}

void drawParticula() {
  stroke(0);
  strokeWeight(2);
  fill(127);
  ellipse(posicion.x, posicion.y, 48, 48);
}

void setup () {
  size(900, 900);
}

void draw() {
  background(0,255,255);
  actualizarParticula();
  drawParticula();
}