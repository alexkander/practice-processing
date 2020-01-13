final int SIZE_SCREEN = 900;
final int CANTIDAD_PARTICULAS = 500;
final float G = 0.1;

float ESCALE = 0.1;
int ORIGEN_X = SIZE_SCREEN / 2;
int ORIGEN_Y = SIZE_SCREEN / 2;
boolean PAUSED = true;

// PVector gravity = new PVector(0, 1);

Particula particulas[] = new Particula[CANTIDAD_PARTICULAS];

class Particula {
  public float masa = 1;
  public PVector posicion = new PVector(0,0);
  public PVector velocidad = new PVector(0, 0);
  public PVector aceleracion = new PVector(0, 0);
  
  public Particula(){
    this.masa = random(1, 20);
    this.posicion.x = random(0, SIZE_SCREEN) - ORIGEN_X;
    this.posicion.y = random(0, SIZE_SCREEN) - ORIGEN_Y;
    this.posicion.mult(1);
    this.posicion.limit(SIZE_SCREEN / 2);
  }

  public void draw(int i) {
    fill(255,255,255);
    ellipse(ORIGEN_X + this.posicion.x, ORIGEN_Y + this.posicion.y, ESCALE * this.masa, ESCALE * this.masa);
    fill(0,0,0);
    //text("m:" + this.masa, 10, 15 + i * 15);
    //text("x:" + this.posicion.x, 90, 15 + i * 15);
    //text("y:" + this.posicion.y, 170, 15 + i * 15);
    //text("vx:" + this.velocidad.x, 250, 15 + i * 15);
    //text("vy:" + this.velocidad.y, 330, 15 + i * 15);
    //text("ax:" + this.aceleracion.x, 410, 15 + i * 15);
    //text("ay:" + this.aceleracion.y, 490, 15 + i * 15);
  }

  void actualizar() {
    this.velocidad.add(this.aceleracion);
    this.posicion.add(this.velocidad);
    this.aceleracion.mult(0);
  }

  void aplicarFuerza(PVector fuerza){
    PVector fuerzaResultante = PVector.div(fuerza, this.masa);
    this.aceleracion.add(fuerzaResultante);
  }

  void aplicarGravedadParticula(Particula p){
    PVector direccion = PVector.sub(p.posicion, this.posicion);
    float distancia = direccion.mag();
    distancia = constrain(distancia, 5, 25);
    float magnitud = (G * this.masa * p.masa) / (distancia * distancia);
    direccion.normalize();
    direccion.mult(magnitud);
    this.aplicarFuerza(direccion);
  }

  void chequearBordes(){
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

void actualizarParticulas() {
  for (int i = 0; i < CANTIDAD_PARTICULAS; ++i) {
    for (int j = 0; j < CANTIDAD_PARTICULAS; ++j) {
      if (i!=j){
        particulas[i].aplicarGravedadParticula(particulas[j]);
      }
    }
    particulas[i].actualizar();
  }
}

void initParticulas(){
  for (int i = 0; i < CANTIDAD_PARTICULAS; ++i) {
    particulas[i] = new Particula();
  }
}

void drawParticulas(){
  
  background(0,255,255);
  // stroke(0,255,0);
  // line(SIZE_SCREEN/2, 0, SIZE_SCREEN/2, SIZE_SCREEN);
  // line(0, SIZE_SCREEN/2, SIZE_SCREEN, SIZE_SCREEN/2);
  
  stroke(255,0,0);
  line(ORIGEN_X, 0, ORIGEN_X, SIZE_SCREEN);
  line(0,ORIGEN_Y,SIZE_SCREEN,ORIGEN_Y);
  
  for (int i = 0; i < CANTIDAD_PARTICULAS; ++i) {
    // particulas[i].chequearBordes();
    particulas[i].draw(i);
  }
}

void setup() {
  size(900, 900);
  initParticulas();
  drawParticulas();
}

void draw() {
  if (PAUSED) return;
  actualizarParticulas();
  drawParticulas();
}

void keyPressed() {
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
  drawParticulas();
}
