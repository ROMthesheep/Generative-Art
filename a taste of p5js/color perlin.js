var xoff = 0;
var yoff = 0;
var zoff = 0;
var inc=0.01;
var scl = 10;
  var fr;
var ancho=400//window.innerWidth;
var alto=400//window.innerHeight;



function setup() {
  var myCanvas = createCanvas(ancho, alto);
  // myCanvas.parent("holi");
  pixelDensity(1);
  col=floor(ancho/scl);
  row=floor(alto/scl);
  fr = createP("");
}
function draw() {
  yoff=0;
  stroke(255);
  background(0);
  strokeWeight(scl);
  // loadPixels();
  for (var i = 0; i < 3; ++i) {
    for (var x = 0; x < row; x++) {
      xoff=1
      for (var y = 0; y < col; y++) {
        var index = (x+y*ancho)*4;

        var perlin = floor(noise(xoff,yoff,zoff)*255);

        if (perlin % 7 ==0) {
          fill(perlin,perlin*0.7,perlin*0.7);
          stroke(perlin,perlin*0.7,perlin*0.7);
          
          point(x*scl, y*scl, scl, scl);
        // pixels[index]=perlin;
        // pixels[index+1]=perlin*0.7;
        // pixels[index+2]=perlin*.7;
        // pixels[index+3]=255;
          
        }
        else if (perlin % 11 == 0) {
          fill(perlin*.7,perlin,perlin*0.7);
          stroke(perlin*.7,perlin,perlin*0.7);
          
          point(x*scl, y*scl, scl, scl);
        // pixels[index]=perlin*.7;
        // pixels[index+1]=perlin*.7;
        // pixels[index+2]=perlin;
        // pixels[index+3]=255;
        }
        else if (perlin % 13 == 0){
          fill(perlin*0.7,perlin*0.7,perlin);
          stroke(perlin*0.7,perlin*0.7,perlin);
          
          point(x*scl, y*scl, scl, scl);
          // pixels[index]=perlin*.7;
          // pixels[index+1]=perlin;
          // pixels[index+2]=perlin*.7;
          // pixels[index+3]=255;
        }
        else{
          fill(0);
          noStroke(0);
          
          point(x*scl, y*scl, scl, scl);
          // pixels[index]=0;
          // pixels[index+1]=0;
          // pixels[index+2]=0;
          // pixels[index+3]=255;
        }

        
        xoff+=inc;
      }
      yoff+=inc;
    }
  }
  zoff+=inc;
  // updatePixels(); 
  // noLoop(); 
  fr.html(floor(frameRate()));
}