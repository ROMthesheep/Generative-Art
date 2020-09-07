let paso=1;
let angulo = 0;
let tam = 1;
let posiciones= [];
const maxp=1000;

function setup() {
  
  createCanvas(1280 ,960  , WEBGL);
  background(15, 15, 15);
  for (let index = 0; index < maxp; index++) {
    const x = int(random(-500,500))
    const y = int(random(-500,500))
    const z = int(random(-500,500))
    const color = [int(random(0,255)),int(random(0,255)),int(random(0,255))]
    const hueshift = random
    posiciones.push({
      x,y,z,hueshift,color
    })
  }
}
function draw(){

  rotateX(frameCount * random(1,9)/10000);
  rotateY(frameCount * random(1,9)/10000);
  // rotateZ(frameCount * random(1,9)/10000);

  angulo+=paso;
  strokeWeight(1+noise(angulo)*5)

  
  noFill()
  posiciones.forEach(element => {
    stroke(element.color)
    point(element.x,element.y,element.z)
  });
  

  
}
function keyPressed(key) {
  if (key.keyCode == 80)
      save()
    
}
