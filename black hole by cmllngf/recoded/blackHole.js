const HEIGH = innerHeight;
const WIDTH = innerWidth;

const blackHoleRadius = 150;
const maxPart = 2000;
const maxPartEspeciales = 1000;

let semilla;
let scalar = 1;
let vel = 0.03;
let velScal = 0.1;
let step = 1;
let particulas = [];



function preload(){
  seed = random(99999);
}

function setup(){
  createCanvas(WIDTH, HEIGH);

  for (let index = 0; index < maxPart; index++) {
    const x = int(random(-1500,1500));
    const z = int(random(-1500,1500));
    const scalar =  dist(x,z,0,0);
    const a = atan2(z,x) //mide el angulo entre el 0,0 y las cordenadas que le des, escupe radianes
    particulas.push({
      a,
      scalar,
      previous: createVector(scalar * cos(a), scalar * 0.35 * sin(a)),
    })
  } 
}

function draw(){
  background(0);
  fill(1)
  noStroke()
  randomSeed(seed);
  translate(width/2,height/2);
  circle(0, blackHoleRadius/2,blackHoleRadius*2)

  for (let i = 0; i < particulas.length; i++) {
    noFill()
    if (i > maxPartEspeciales) {
      stroke(255);
    }
    else{
      stroke(random(0,255),random(0,255),random(0,255));
    }
    
    let scalar = particulas[i].scalar - velScal;
    const y = scalar < 800 ? map(scalar, blackHoleRadius, 800, blackHoleRadius/2, 0):0;
    let x = cos (particulas[i].a) * particulas[i].scalar;
    let z = sin (particulas[i].a) * 0.35 * particulas[i].scalar + y;
    strokeWeight(map(z,-600,600,1,5));
    if (z > 50 || dist(x,z,0,blackHoleRadius/2)>blackHoleRadius) {
      
      line(x,z,particulas[i].previous.x,particulas[i].previous.y);      
    }
    if(scalar <= blackHoleRadius){
      x = int(random(-1500, 1500));
      z = int(random(-1500, 1500));
      scalar = dist(x,z,0,0);
      const a = atan2(z,x)
      particulas[i] ={
        a,
        scalar,
        previous: createVector(scalar * cos(a), scalar * .35 * sin(a))
      }
    }
    else{
      particulas[i] = {
        a: particulas[i].a + map(scalar, blackHoleRadius, 1500, vel*1.2, -vel/5),
        scalar,
        previous: createVector(x,z)
      }
    }
  }
}

function keyPressed(key) {
  if(key.keyCode === 80) //P
    save()
}
