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
//Constantes de las particulas:
var tamaxParticula = 3;
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
        this.color = 'black';
        this.x = GetRandomFloat(0, w);
        this.y = GetRandomFloat(0, h);
        this.sp = GetRandomFloat(0, velmaxParticula);
        this.theta = GetRandomFloat(0, 2 * Math.PI);
        this.radio = GetRandomFloat(0.05, tamaxParticula);
        this.vida = this.ttl = GetRandomInt(25, 50);
        this.color = paleta[GetRandomInt(0, paleta.length)];
    }
    Particula.prototype.Update = function () {
        // moviomiento de las particulas
        var dradio = GetRandomFloat(-tamaxParticula / 10, tamaxParticula / 10);
        var dsp = GetRandomFloat(-0.01, 0.01);
        var dtheta = GetRandomFloat(-Math.PI / 8, Math.PI / 8);
        this.sp += dsp;
        this.theta += dtheta;
        var _a = DePolaresACartesianas(this.sp, this.theta), dx = _a[0], dy = _a[1];
        this.x += dx;
        this.y += dy;
        this.radio += dradio;
        this.radio += ((this.radio < 0) ? -2 * dradio : 0); //oscilacion
    };
    Particula.prototype.Draw = function (CTX) {
        CTX.save();
        this.experiment1(CTX);
        CTX.restore();
    };
    Particula.prototype.experiment1 = function (CTX) {
        CTX.fillStyle = this.color;
        var circle = new Path2D();
        circle.arc(this.x, this.y, this.radio, 0, 2 * Math.PI);
        CTX.fill(circle);
    };
    return Particula;
}());
// constantes de la simulacion:
var totparciculas = 2000; //spawncap
var paletas = [
    ["#faf8d4", "#ebdccb", "#c3baaa", "#91818a", "#b2a3b5"],
    ["#d8f793", "#a0ca92", "#75b09c", "#998650", "#e0be36"],
    ["#2b4162", "#385f71", "#f5f0f6", "#d7b377", "#8f754f"],
    ["#272932", "#4d7ea8", "#828489", "#9e90a2", "#b6c2d9"],
    ["#1a181b", "#564d65", "#3e8989", "#2cda9d", "#05f140"],
    ["#f5e6e8", "#d5c6e0", "#aaa1c8", "#967aa1", "#192a51"],
    ["#d4afb9", "#d1cfe2", "#9cadce", "#7ec4cf", "#52b2cf"]
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
    Simulation.prototype.Update = function () {
        //update particles
        this.particulas.forEach(function (p) { return p.Update(); });
    };
    Simulation.prototype.Draw = function (CTX) {
        //fondo:
        if (!this.init) {
            CTX.fillStyle = this.paleta[0];
            CTX.fillRect(0, 0, this.width, this.height);
            this.init = true;
        }
        //particulas
        this.particulas.forEach(function (p) { return p.Draw(CTX); });
    };
    return Simulation;
}());
function bootstrapper() {
    var WIDTH = 500;
    var HEIGHT = 300;
    var updateFramerate = 50;
    var renderFrametime = 50;
    var CANVAS = document.createElement('canvas');
    document.body.appendChild(CANVAS);
    if (!CANVAS)
        return;
    CANVAS.width = WIDTH;
    CANVAS.height = HEIGHT;
    var CTX = CANVAS.getContext('2d');
    if (!CTX)
        return;
    CTX.imageSmoothingEnabled = true;
    CTX.imageSmoothingQuality = 'high';
    var sim = new Simulation(WIDTH, HEIGHT);
    setInterval(function () { sim.Update(); }, 1000 / updateFramerate);
    setInterval(function () { sim.Draw(CTX); }, 1000 / renderFrametime);
}
bootstrapper();
