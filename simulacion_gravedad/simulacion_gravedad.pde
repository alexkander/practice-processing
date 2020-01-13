
final int PARTICULAS_COUNT = 3;
final float G = 100;

// Particulas [m1, coordX, coordY];
float particulas[][] = {
  { 10, 70, 130 },
  { 20, 650, 910 },
  { 100, 500, 500 },
};

// Vectores de fuerzas que ejecercen las masas entre si
float fuerzas[][][] = {
  { { 0, 0, 0 }, { 0, 0, 0 }, { 0, 0, 0 } },
  { { 0, 0, 0 }, { 0, 0, 0 }, { 0, 0, 0 } },
  { { 0, 0, 0 }, { 0, 0, 0 }, { 0, 0, 0 } },
};

float sumaVectores[][] = {
  { 0, 0, 0 },
  { 0, 0, 0 },
  { 0, 0, 0 },
};

void calcularVectoresDeFuerza() {
  for(int i = 0 ; i<PARTICULAS_COUNT; i++) {
    for(int j = 0 ; j<PARTICULAS_COUNT; j++) {
      if (i<=j) continue;
      
      float m1 = particulas[i][0];
      float x1 = (float)particulas[i][1];
      float y1 = (float)particulas[i][2];
      
      float m2 = particulas[j][0];
      float x2 = (float)particulas[j][1];
      float y2 = (float)particulas[j][2];
      
      // Distancia entre dos puntos
      float r = sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
      
      // Ley de gravitación universal
      float f = G * m1 * m2 / pow(r, 2);
      
      fuerzas[i][j][0] = f;
      fuerzas[i][j][1] = x1 - x2;
      fuerzas[i][j][2] = y1 - y2;
      
      fuerzas[j][i][0] = -f;
      fuerzas[j][i][1] = x2 - x1;
      fuerzas[j][i][2] = y2 - y1;
      
    }
  }
}

void sumarVectores(){
  for(int i = 0 ; i<PARTICULAS_COUNT; i++) {
    sumaVectores[i][0] = sumaVectores[i][1] = sumaVectores[i][2] = 0;
    for(int j = 0 ; j<PARTICULAS_COUNT; j++) {
      sumaVectores[i][0] = sumaVectores[i][0] + fuerzas[i][j][0];
      sumaVectores[i][1] = sumaVectores[i][1] + fuerzas[i][j][1];
      sumaVectores[i][2] = sumaVectores[i][2] + fuerzas[i][j][2];
    }
  }
}

void printFuerzas(){
  println();
  for(int i = 0 ; i<PARTICULAS_COUNT; i++) {
    for(int j = 0 ; j<PARTICULAS_COUNT; j++) {
      System.out.printf("%10.2f, %04.2f, %04.2f", fuerzas[i][j][0], fuerzas[i][j][1], fuerzas[i][j][2]);
    }
    println();
  }
}

void printSumaFuerzas(){
  println();
  for(int i = 0 ; i<PARTICULAS_COUNT; i++) {
    System.out.printf("%10.2f, %04.2f, %04.2f", sumaVectores[i][0], sumaVectores[i][1], sumaVectores[i][2]);
    println();
  }
}

void drawMasas(){
  for(int i = 0 ; i<PARTICULAS_COUNT; i++) {
    float masa = particulas[i][0];
    float posX = particulas[i][1];
    float posY = particulas[i][2];
    ellipse((int)posX, (int)posY, masa, masa);
  }
}


void setup() {
  size(1000, 1000);
}

void draw() {
  background(0,255,255);
  stroke(0,0,0);
  
  calcularVectoresDeFuerza();
  sumarVectores();
  
  printFuerzas();
  printSumaFuerzas();
  print("-----");
  drawMasas();
  delay(1000);
  
}
