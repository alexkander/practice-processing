final int SCREEN_SIZE = 900;

PVector walker = new PVector(SCREEN_SIZE/2, SCREEN_SIZE/2);

void setup() {
  size(900, 900);

  background(0,255,255);

}

void draw() {

  walker.x = walker.x + random(-5, 5);
  walker.y = walker.y + random(-5, 5);

  strokeWeight(3);
  stroke(0, 0, 0);
  point(walker.x, walker.y);

}