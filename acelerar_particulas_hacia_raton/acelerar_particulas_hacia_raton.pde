final int SCREEN_SIZE = 900;
final float ACELERACION = 0.2;

final int CANTIDAD_PARTICULAS = 100;

PVector particulas[][] = new PVector [CANTIDAD_PARTICULAS][2];

PVector velocidad = new PVector(0, 0);

void actualizarParticula(PVector particula, PVector velocidad) {
  PVector aceleracion = new PVector(mouseX, mouseY);
  aceleracion.sub(particula);
  aceleracion.normalize();
  aceleracion.mult(ACELERACION);
  velocidad.add(aceleracion);
  velocidad.limit(10);
  particula.add(velocidad);
}

void drawParticula(PVector particula) {
  stroke(0);
  strokeWeight(2);
  fill(127);
  ellipse(particula.x, particula.y, 5, 5);
}

void initParticulas(){
  for (int i = 0; i < CANTIDAD_PARTICULAS; ++i) {
    particulas[i][0] = new PVector(random(0, SCREEN_SIZE), random(0, SCREEN_SIZE));
    particulas[i][1] = new PVector(0, 0);
  }
}

void setup () {
  size(900, 900);
  initParticulas();
}

void draw() {
  background(0,255,255);
  for (int i = 0; i < CANTIDAD_PARTICULAS; ++i) {
    actualizarParticula(particulas[i][0], particulas[i][1]);
    drawParticula(particulas[i][0]);
  }
}
