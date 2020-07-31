
var radius1 = 15;
var angle = 0;
var speed = 0.05;

var ancho = window.innerWidth;
var alto = window.innerHeight;
var centerX = ancho/2;
var centerY = alto/2;

function setup() {
  createCanvas(ancho, alto);
  x=350;
  y=350;
  sentido=true;
  poslluviaX=0;
  poslluviaY=0;

}

function draw() {
  poslluviaX=random(0,400);
  poslluviaY+=.5;
  background(220,55);
  rectMode(CENTER);
  
  line(random(0,ancho),random(0,alto),random(0,ancho),random(0,alto));
  line(random(0,ancho),random(0,alto),random(0,ancho),random(0,alto));
  line(random(0,ancho),random(0,alto),random(0,ancho),random(0,alto));
 
  
  noFill();

  var cx = centerX + radius1 * cos(angle);
  var cy = centerY + radius1 * sin(angle);
  rect(cx,cy,x,y);
  ellipse(cx, cy, 50, 50);

  angle = angle + speed;

  noFill();
  if(x<50 && y<50){
    sentido=false;
  }
  else if(x>ancho  && y>alto)
    sentido=true;

  if (sentido==true){
    x--;
    y--;
  } else{
    x++;
    y++;
  }


}
  function mousePressed() {
    background(220);
  }