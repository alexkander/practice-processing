final int SCREEN_SIZE = 900;

PVector posicion = new PVector(SCREEN_SIZE/2, SCREEN_SIZE/2);
PVector velocidad = new PVector(0, 0);
PVector aceleracion = new PVector(0, 0);

void actualizarPosicion() {
  velocidad.add(aceleracion);
  posicion.add(velocidad);
  velocidad.limit(50);
  if(posicion.x<0){
    posicion.x = SCREEN_SIZE;
  }
  if (posicion.x>=SCREEN_SIZE){
    posicion.x = 0;
  }
  if(posicion.y<0){
    posicion.y = SCREEN_SIZE;
  }
  if (posicion.y>=SCREEN_SIZE){
    posicion.y = 0;
  }
}

void drawCarro() {
  stroke(0);
  strokeWeight(2);
  fill(255, 0, 0);
  rect(posicion.x-52, posicion.y-59, 60, 60);
  rect(posicion.x-74, posicion.y-30, 100, 31);
  fill(92, 92, 92);
  ellipse(posicion.x, posicion.y, 30, 26);
  ellipse(posicion.x-50, posicion.y, 30, 30);
}

void setup () {
  size(900, 900);
}

void draw() {
  background(0,255,255);
  actualizarPosicion();
  drawCarro();
  if (keyPressed) {
    aceleracion.x = 1;
  } else if(velocidad.x>0){
    aceleracion.x = -1;
  } else {
    aceleracion.x = 0;
  }
}
