"use strict";
//tools
//varios generadores de numeros aleatorios:
function GetRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
function GetRandomInt(min, max) {
  return Math.floor(GetRandomFloat(min, max));
}
//funcion de trasnformacion de coordenadas polares a coordenadas cartesianas
function DePolaresACartesianas(v, theta) {
  return [v * Math.cos(theta), v * Math.sin(theta)];
}
function ToLuma(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
//se asegura que el valor esta en el rango
function Clamp(min, max, value) {
  return value > max ? max : value < min ? min : value;
}
//Constantes de las particulas:
var tamaxParticula = 6;
var velmaxParticula = 5.0;
var Particula = /** @class */ (function () {
  function Particula(w, h, paleta) {
    this.w = w;
    this.h = h;
    this.paleta = paleta;
    this.x = 0;
    this.y = 0; //location
    this.sp = 0;
    this.theta = 0; //vector de velocidad
    this.radio = 1.0; //dimensiones de la particula
    this.ttl = 500; //tiempo restante de vida
    this.vida = 500; //tiempo viva
    this.alpha = 1.0;
    this.color = "black";
    this.reset();
  }
  Particula.prototype.reset = function () {
    this.x = GetRandomFloat(0, this.w);
    this.y = GetRandomFloat(0, this.h);
    this.sp = GetRandomFloat(0, velmaxParticula);
    this.theta = GetRandomFloat(0, 2 * Math.PI);
    this.radio = GetRandomFloat(0.05, 0);
    this.vida = this.ttl = GetRandomInt(25, 50);
    this.color = this.paleta[GetRandomInt(0, this.paleta.length)];
    this.ttl = this.vida = GetRandomInt(25, 50);
  };
  Particula.prototype.imgLuma = function (imgData) {
    var p = Math.floor(this.x) + Math.floor(this.y) * imgData.width;
    //extraccion de valores rgba
    var i = Math.floor(p * 4);
    var r = imgData.data[i + 0];
    var g = imgData.data[i + 1];
    var b = imgData.data[i + 2];
    var luma = ToLuma(r, g, b); // de 0 a 255
    var ln = 1 - luma / 255.0; // cuanto mas ln mas oscuro el pixel
    return ln;
  };
  Particula.prototype.Update = function (imgData) {
    var ln = this.imgLuma(imgData);
    var lt = (this.vida - this.ttl) / this.vida;
    this.alpha = lt;
    // moviomiento de las particulas
    var dradio = GetRandomFloat(-tamaxParticula / 5, tamaxParticula / 5);
    var dsp = GetRandomFloat(-0.5, 0.5);
    var dtheta = GetRandomFloat(-Math.PI / 8, Math.PI / 8);
    this.sp += dsp;
    this.theta += dtheta;
    var _a = DePolaresACartesianas(this.sp * ln, this.theta * ln),
      dx = _a[0],
      dy = _a[1];
    this.x += dx;
    this.y += dy;
    this.x = Clamp(0, this.x, this.x);
    this.y = Clamp(0, this.h, this.y);
    this.radio += dradio;
    this.radio = Clamp(0, tamaxParticula, this.radio) * ln;
    //gestion de spawn
    this.ttl += -1;
    if (this.ttl == 0) {
      this.reset();
    }
  };
  Particula.prototype.Draw = function (CTX) {
    CTX.save();
    this.experiment1(CTX);
    CTX.restore();
  };
  Particula.prototype.experiment1 = function (CTX) {
    CTX.fillStyle = this.color;
    CTX.globalAlpha = this.alpha;
    var circle = new Path2D();
    circle.arc(this.x, this.y, this.radio, 0, 2 * Math.PI);
    CTX.fill(circle);
  };
  return Particula;
})();
// constantes de la simulacion:
var totparciculas = 1000; //spawncap
var paletas = [
  ["#faf8d4", "#ebdccb", "#c3baaa", "#91818a", "#b2a3b5"],
  ["#d8f793", "#a0ca92", "#75b09c", "#998650", "#e0be36"],
  ["#2b4162", "#385f71", "#f5f0f6", "#d7b377", "#8f754f"],
  ["#272932", "#4d7ea8", "#828489", "#9e90a2", "#b6c2d9"],
  ["#1a181b", "#564d65", "#3e8989", "#2cda9d", "#05f140"],
  ["#f5e6e8", "#d5c6e0", "#aaa1c8", "#967aa1", "#192a51"],
  ["#d4afb9", "#d1cfe2", "#9cadce", "#7ec4cf", "#52b2cf"],
];
var Simulation = /** @class */ (function () {
  function Simulation(width, height) {
    this.width = width;
    this.height = height;
    this.particulas = [];
    this.paleta = [];
    this.init = false;
    //selecionador de paleta
    this.paleta = paletas[GetRandomInt(0, paletas.length)];
    //spawn de particulas
    for (var index = 0; index < totparciculas; index++) {
      this.particulas.push(new Particula(this.width, this.height, this.paleta));
    }
  }
  Simulation.prototype.Update = function (imgData) {
    //update particles
    this.particulas.forEach(function (p) {
      return p.Update(imgData);
    });
  };
  Simulation.prototype.Draw = function (CTX) {
    //fondo:
    if (!this.init) {
      CTX.fillStyle = this.paleta[0];
      CTX.fillRect(0, 0, this.width, this.height);
      this.init = true;
    }
    //particulas
    this.particulas.forEach(function (p) {
      return p.Draw(CTX);
    });
  };
  return Simulation;
})();
function dibujameEsta(imgCtx, width, height) {
  var updateFramerate = 50;
  var renderFrametime = 50;
  var CANVAS = document.createElement("canvas");
  document.body.appendChild(CANVAS);
  if (!CANVAS) return;
  CANVAS.width = width;
  CANVAS.height = height;
  var CTX = CANVAS.getContext("2d");
  if (!CTX) return;
  CTX.imageSmoothingEnabled = true;
  CTX.imageSmoothingQuality = "high";
  var sim = new Simulation(width, height);
  var imgData = imgCtx.getImageData(0, 0, width, height);
  setInterval(function () {
    sim.Update(imgData);
  }, 1000 / updateFramerate);
  setInterval(function () {
    sim.Draw(CTX);
  }, 1000 / renderFrametime);
}
function dualpic(salsa, width, height) {
  var canvasImg = document.createElement("canvas");
  document.body.appendChild(canvasImg);
  canvasImg.id = "imagenGuia";
  canvasImg.width = width;
  canvasImg.height = height;
  var CTX = canvasImg.getContext("2d");
  if (!CTX) {
    return;
  }
  //creamos un elemento imagen que subir
  var imagen = new window.Image();
  if (!imagen) {
    return;
  }
  imagen.crossOrigin = "Anonymous";
  imagen.onload = function (e) {
    CTX.drawImage(imagen, 0, 0, width, height);
    canvasImg.hidden = true;
    dibujameEsta(CTX, width, height);
  };
  imagen.src = salsa;
}

function bootstrapper() {
  if (window.innerWidth < 800) {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerWidth;
  } else {
    var WIDTH = 800;
    var HEIGHT = 800;
  }

  var salsa = "https://i.imgur.com/P99fBQ4.png";
  dualpic(salsa, WIDTH, HEIGHT);
}
bootstrapper();
