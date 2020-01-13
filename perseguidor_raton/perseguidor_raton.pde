final int SCREEN_SIZE = 900;

final float MAX_VEL = 15; 
final float ACELERACION = 1; 

PVector maxDir = new PVector(SCREEN_SIZE, SCREEN_SIZE);
PVector posicion = new PVector(SCREEN_SIZE/2, SCREEN_SIZE/2);
PVector velocidad = new PVector(0, 0);

final float MAX_MAG_VEL = maxDir.mag();

void actualizarParticula() {
  PVector aceleracion = new PVector(mouseX, mouseY);
  aceleracion.sub(posicion);
  float closeness = (MAX_MAG_VEL - aceleracion.mag()) / MAX_MAG_VEL / 2;
  aceleracion.normalize();
  aceleracion.mult(closeness);
  velocidad.add(aceleracion);
  // velocidad.limit(MAX_VEL);
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
