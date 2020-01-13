final int SCREEN_SIZE = 900;

final int CANTIDAD_PARTICULAS = 10;

float masas[] = new float[CANTIDAD_PARTICULAS];
PVector particulas[][] = new PVector [CANTIDAD_PARTICULAS][3];

PVector posicion = new PVector(random(0, SCREEN_SIZE), 0);
PVector velocidad = new PVector(0, 0);
PVector aceleracion = new PVector(0, 0);

PVector wind = new PVector(0.1, 0);
PVector gravity = new PVector(0, 1);

void aplicarFuerza(float masa, PVector aceleracion, PVector fuerza){
  PVector fuerzaResultante = PVector.div(fuerza, masa);
  aceleracion.add(fuerzaResultante);
}

void actualizar(PVector posicion, PVector velocidad, PVector aceleracion) {
  velocidad.add(aceleracion);
  posicion.add(velocidad);
  aceleracion.mult(0);
}

void chequearBordes(PVector posicion, PVector velocidad){
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

void drawParticula(float masa, PVector posicion) {
  stroke(0);
  strokeWeight(2);
  fill(255, 255, 255, 127);
  ellipse(posicion.x, posicion.y, masa*16, masa*16);
}

void initParticulas() {
  for (int i = 0; i < CANTIDAD_PARTICULAS; ++i) {
    masas[i] = random(0.1, 5);
    particulas[i][0] = new PVector(0, 0);
    particulas[i][1] = new PVector(0, 0);
    particulas[i][2] = new PVector(0, 0);
  }
}

void setup() {
  size(900, 900);
  initParticulas();
}

void draw() {
  background(0,255,255);
  for (int i = 0; i < CANTIDAD_PARTICULAS; ++i) {
    aplicarFuerza(masas[i], particulas[i][2], wind);
    aplicarFuerza(masas[i], particulas[i][2], PVector.mult(gravity, masas[i]));
    actualizar(particulas[i][0], particulas[i][1], particulas[i][2]);
    chequearBordes(particulas[i][0],  particulas[i][1]);
    drawParticula(masas[i], particulas[i][0]);
  }
}
