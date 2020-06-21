//tools
//varios generadores de numeros aleatorios:
function GetRandomFloat(min: number, max: number): number{
  return Math.random() * (max-min)+min
}
function GetRandomInt(min: number, max: number): number {
  return Math.floor(GetRandomFloat(min,max))
}

//funcion de trasnformacion de coordenadas polares a coordenadas cartesianas
function DePolaresACartesianas(v: number, theta: number) {
  return [v*Math.cos(theta),v*Math.sin(theta)]
}
////////////////////////////////////////////////////////////////////////////////

interface IsimObject{ //interfaz para todos los objetos incluidos en la simulacion
  //actualiza el estado del objeto (back)
  Update(): void
  //actualiza el estado del canvas (front)
  Draw(CTX:CanvasRenderingContext2D):void
}
//Constantes de las particulas:

const tamaxParticula = 3
const velmaxParticula = 5.0


class Particula implements IsimObject{
  x = 0; y = 0; //location
  sp = 0; theta = 0//vector de velocidad
  radio = 1.0 //dimensiones de la particula
  ttl = 500 //tiempo restante de vida
  vida = 500 //tiempo viva

  color = 'black'
  constructor(private w: number, private h: number, private paleta:string[]) { 
    this.x = GetRandomFloat(0, w)
    this.y = GetRandomFloat(0, h)

    this.sp = GetRandomFloat(0, velmaxParticula)
    this.theta = GetRandomFloat(0, 2 * Math.PI)
    this.radio = GetRandomFloat(0.05, tamaxParticula) 
    
    this.vida = this.ttl = GetRandomInt(25, 50)
    
    this.color=paleta[GetRandomInt(0,paleta.length)]

  }
  Update() {
    // moviomiento de las particulas
    let dradio = GetRandomFloat(-tamaxParticula / 10, tamaxParticula / 10)
    const dsp = GetRandomFloat(-0.01, 0.01)
    const dtheta = GetRandomFloat(-Math.PI / 8, Math.PI / 8)
    
    
    this.sp += dsp
    this.theta += dtheta

    const [dx, dy] = DePolaresACartesianas(this.sp, this.theta)

    this.x += dx
    this.y += dy
    this.radio += dradio
    this.radio += ((this.radio<0) ? - 2*dradio : 0) //oscilacion
    

  }
  Draw(CTX:CanvasRenderingContext2D) {
    CTX.save()
    this.experiment1(CTX)
    CTX.restore()
  }
  experiment1(CTX:CanvasRenderingContext2D) {
    CTX.fillStyle = this.color
    let circle = new Path2D()
    circle.arc(this.x, this.y, this.radio, 0, 2 * Math.PI)
    CTX.fill(circle)
  }
}
// constantes de la simulacion:
const totparciculas = 2000 //spawncap
const paletas = [
  ["#faf8d4", "#ebdccb", "#c3baaa", "#91818a", "#b2a3b5"],
  ["#d8f793", "#a0ca92", "#75b09c", "#998650", "#e0be36"],
  ["#2b4162", "#385f71", "#f5f0f6", "#d7b377", "#8f754f"],
  ["#272932", "#4d7ea8", "#828489", "#9e90a2", "#b6c2d9"],
  ["#1a181b", "#564d65", "#3e8989", "#2cda9d", "#05f140"],
  ["#f5e6e8", "#d5c6e0", "#aaa1c8", "#967aa1", "#192a51"],
  ["#d4afb9", "#d1cfe2", "#9cadce", "#7ec4cf", "#52b2cf"]
]
class Simulation implements IsimObject{
  particulas: Particula[] = []
  paleta:string[]=[]
  constructor(private width: number, private height: number) {
    //selecionador de paleta
    this.paleta = paletas[GetRandomInt(0,paletas.length)]
    //spawn de particulas
    for (let index = 0; index < totparciculas; index++) {
      this.particulas.push(
        new Particula(this.width,this.height,this.paleta)
      )
    }
   }
  Update() {
    //update particles
    this.particulas.forEach( p => p.Update())
    
  }
  init = false
  Draw(CTX: CanvasRenderingContext2D) {
    //fondo:
    if (!this.init) {
      CTX.fillStyle = this.paleta[0]
      CTX.fillRect(0, 0, this.width, this.height)
      this.init = true
      
    }
    
    //particulas
    this.particulas.forEach( p => p.Draw(CTX))
  }
}



function bootstrapper() {
  const WIDTH = window.innerWidth
  const HEIGHT = window.innerHeight

  const updateFramerate = 50
  const renderFrametime =50

  const CANVAS = document.createElement('canvas')
  document.body.appendChild(CANVAS)

  if (!CANVAS) return

  CANVAS.width = WIDTH
  CANVAS.height = HEIGHT

  const CTX = CANVAS.getContext('2d')

  if (!CTX) return
  CTX.imageSmoothingEnabled = true
  CTX.imageSmoothingQuality = 'high'

  const sim = new Simulation(WIDTH,HEIGHT)

  setInterval(
    () => { sim.Update() },
    1000/updateFramerate
  )
  setInterval(
    () => { sim.Draw(CTX) },
    1000/renderFrametime
  )

}

bootstrapper()