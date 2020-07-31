var xoff=0;
var yoff=0;
var zoff=0;
var phase=0;

var noiseMax=20;

var ancho=600//window.innerWidth;
var alto=600//window.innerHeight;

let slider;

function setup() {
  createCanvas(ancho, alto);
  // saveFrames("a","jpg","5","22");
  // slider = createSlider(0,10,0,.1);
}

function draw() {
  noiseSeed(50);
  background(17);
  translate(width / 2, height / 2);
  stroke(255);
  noFill();
  // noiseMax=slider.value()
  for (let index = alto/15; index < alto/2; index=index*1.4+5) {
    beginShape();
  for (let a = 0; a < TWO_PI; a += 0.01) {
    if (random(2)%2==0) signo= 1; else signo=-1;

    xoff = map(cos(a+phase*signo),-1,1,0,noiseMax);
    yoff = map(sin(a),-1,1,0,noiseMax);
    let r = map(noise(xoff,yoff,zoff),0,1,05+index,50+index);
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
    zoff+=0.000004;
  }
  zoff+=0.000004;
  phase+=0.0005;
  endShape(CLOSE);
}
  // noLoop()
}
