  var ancho = window.innerWidth;
  var alto = window.innerHeight;
  var xoff = 0;
  var zoff = 0;
  var scl = 20;
  var cols, rows;
  inc = 0.4;
  var fr;
  var flowfield = [];
  // var yoff=1000;

  var particulas = [];

  function setup() {
    var myCanvas = createCanvas(1000, 1000);
    myCanvas.parent("holi");
    cols = floor(width / scl);
    rows = floor(height / scl);
    fr = createP("");
    flowfield = new Array(cols, rows);
    for (var i = 0; i < 9000; ++i) {
      particulas[i] = new Particula();
    }
    background(0);
  }
  function draw() {
    var yoff = 0;

    for (var x = 0; x < rows; x++) {
      xoff = 0;
      for (var y = 0; y < cols; y++) {
        var index = x + y * cols;

        angle = noise(xoff, yoff, zoff) * TWO_PI;
        var v = p5.Vector.fromAngle(angle);
        flowfield[index] = v;
        v.setMag(3);
        xoff += inc;
        // fill(r);
        // rect(x*scl, y*scl, scl, scl);

        // line(x*scl, y*scl, x*scl+10, y*scl+10);
        stroke(0, 50);
        strokeWeight(1);
        push();
        translate(x * scl, y * scl);
        rotate(v.heading());
        // line(0,0,scl,0)
        pop();
      }
      yoff += inc;
      zoff += 0.0004;
    }

    for (var i = 0; i < particulas.length; ++i) {
      particulas[i].follow(flowfield);
      particulas[i].update();
      particulas[i].show();
      particulas[i].edges();
    }

    // background(0,5);
    // fr.html(floor(frameRate()));
  }
