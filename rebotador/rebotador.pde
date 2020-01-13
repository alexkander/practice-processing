final int SCREEN_SIZE = 900;

PVector posicion = new PVector(450, 450);

PVector velocidad = new PVector(5, 15.3);

void setup() {
  size(900, 900);
}

void draw() {
  background(0,255,255);

  posicion.add(velocidad);

  // Check for bouncing.
  if ((posicion.x > width) || (posicion.x < 0)) {
    velocidad.x *= -1;
  }
  if ((posicion.y > height) || (posicion.y < 0)) {
    velocidad.y *= -1;
  }

  noStroke();
  fill(181, 181, 181);
  // Display the ball at the location (x,y).
  ellipse(posicion.x, posicion.y, 32, 32);
  
}
