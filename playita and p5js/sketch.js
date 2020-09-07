let tau = 0;
const vel = .005;
const WIDTH = innerWidth;
const HEIGHT = innerHeight;

const maxPlanetas = 12;
const radio = 100;

let particula = [];


function setup() {
    spa = .6 // random(0.6, 1);

    createCanvas(WIDTH, HEIGHT);

    for (let index = 0; index < maxPlanetas; index++) {
        const distancia = random(1.1, 1.2);
        const offset = random(0, 360);
        const tamaño = int(random(1, 10));
        const lunas = int(random(0, 3));
        const color = createVector(random(0, 255), random(0, 255), random(0, 255));
        const anillos = int(random(0, 3));
        const velOrb = (int(random(0, 5))) / 1000;
        const angulo = 0;

        particula.push({
            distancia,
            offset,
            tamaño,
            lunas,
            color,
            anillos,
            velOrb,
            angulo
        })
    }
}

function draw() {
    let espacio = 100;
    background(0, 0, 0, 255);
    stroke(255);
    noFill()
    translate(WIDTH / 2, HEIGHT / 2);
    strokeWeight(1)
    circle(0, 0, radio)
    offsetX = 0;
    offsetY = 0;


    let i = 0;
    tau += vel * 2
    particula.forEach(planeta => {
        espacio = espacio * planeta.distancia;
        planeta.angulo += vel + planeta.velOrb;
        x = cos(planeta.angulo + offsetX + planeta.offset) * espacio;
        y = sin(planeta.angulo + offsetY + planeta.offset) * espacio;
        strokeWeight(planeta.tamaño)
        stroke(planeta.color.x, planeta.color.y, planeta.color.z);




        point(x, y);
        if (i > maxPlanetas / 2) {
            switch (planeta.anillos) {
                case 1:
                    strokeWeight(1)
                    circle(x, y, planeta.tamaño * 1.8)
                    break;
                case 2:
                    strokeWeight(1)
                    circle(x, y, planeta.tamaño * 1.8)
                    circle(x, y, planeta.tamaño * 2.4)
                    break;

                default:
                    break;
            }
        }

        if (planeta.tamaño > 5) {
            switch (planeta.lunas) {
                case 1:
                    x1 = x + cos(tau + planeta.offset) * planeta.tamaño * 2
                    y1 = y + sin(tau + planeta.offset) * planeta.tamaño * 2
                    stroke(255)
                    strokeWeight(planeta.tamaño / 2)
                    point(x1, y1)
                    break;
                case 2:
                    x1 = x + cos(tau + planeta.offset) * planeta.tamaño * 2
                    y1 = y + sin(tau + planeta.offset) * planeta.tamaño * 2
                    x2 = x + cos(tau + planeta.offset * 2) * planeta.tamaño * 3
                    y2 = y + sin(tau + planeta.offset * 2) * planeta.tamaño * 3
                    stroke(255)
                    strokeWeight(planeta.tamaño / 2)
                    point(x1, y1)
                    point(x2, y2)
                    break;
                default:
                    break;
            }

        }
        i++;
    });

}

function keyPressed(key) {
    if (key.keyCode == 80)
        save()
}