function Particula() {
  this.pos = createVector(random(width),random(width));
  this.vel = createVector(0,0);
  this.acc = createVector(0,0);
  this.maxv=5;

  this.prevPos = this.pos.copy();

  this.update = function(){
    this.vel.add(this.acc);
    this.vel.limit(this.maxv);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  this.applyforce = function(f){
    this.acc.add(f);
  }

  this.show = function(r,g,b){
    stroke(r,g,b,5);
    strokeWeight(1);
    line(this.pos.x,this.pos.y,this.prevPos.x,this.prevPos.y);
    this.updatePrev();
    
  }
  
  this.updatePrev = function(){
    this.prevPos.x=this.pos.x;
    this.prevPos.y=this.pos.y;
  }

  this.edges = function(){
    if (this.pos.x>width){ 
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x<0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y>height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y<0) {
      this.pos.y = height;
      this.updatePrev();
    }
  }

  this.follow= function(v){
    var x = floor(this.pos.x/scl);
    var y = floor(this.pos.y/scl);
    var index = x+y*cols;
    var force = v[index];
    this.applyforce(force);
  }
}