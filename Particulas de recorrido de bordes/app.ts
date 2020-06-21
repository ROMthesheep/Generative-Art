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

function ToLuma(r: number, g: number, b: number): number {
  return 0.2126*r+0.7152*g+0.0722*b
}

//se asegura que el valor esta en el rango
function Clamp(min: number, max: number, value: number): number{
  return value > max ? max : (value < min ? min : value)
  
}
////////////////////////////////////////////////////////////////////////////////

interface IsimObject{ //interfaz para todos los objetos incluidos en la simulacion
  //actualiza el estado del objeto (back)
  Update(imgData: ImageData): void
  //actualiza el estado del canvas (front)
  Draw(CTX:CanvasRenderingContext2D):void
}
//Constantes de las particulas:

const tamaxParticula = 6
const velmaxParticula = 5.0


class Particula implements IsimObject{
  x = 0; y = 0; //location
  sp = 0; theta = 0//vector de velocidad
  radio = 1.0 //dimensiones de la particula
  ttl = 500 //tiempo restante de vida
  vida = 500 //tiempo viva

  alpha=1.0
  color = 'black'
  constructor(private w: number, private h: number, private paleta:string[]) { 
    this.reset()
    
  }

  reset() {
    this.x = GetRandomFloat(0, this.w)
    this.y = GetRandomFloat(0, this.h)

    this.sp = GetRandomFloat(0, velmaxParticula)
    this.theta = GetRandomFloat(0, 2 * Math.PI)
    this.radio = GetRandomFloat(0.05, 0) 
    
    this.vida = this.ttl = GetRandomInt(25, 50)
    
    this.color=this.paleta[GetRandomInt(0,this.paleta.length)]
    this.ttl=this.vida=GetRandomInt(25,50)
  }

  imgLuma(imgData: ImageData):number {
    const p = Math.floor(this.x) + Math.floor(this.y) * imgData.width
    //extraccion de valores rgba
    const i = Math.floor(p * 4)
    const r = imgData.data[i + 0]
    const g = imgData.data[i + 1]  
    const b = imgData.data[i + 2] 

    const luma = ToLuma(r, g, b) // de 0 a 255
    const ln = 1 - luma / 255.0 // cuanto mas ln mas oscuro el pixel
    return ln
  }

  Update(imgData: ImageData) {
    const ln = this.imgLuma(imgData)
    const lt = (this.vida - this.ttl) / this.vida
    this.alpha=lt
    // moviomiento de las particulas
    let dradio = GetRandomFloat(-tamaxParticula / 5, tamaxParticula / 5)
    const dsp = GetRandomFloat(-0.5, 0.5)
    const dtheta = GetRandomFloat(-Math.PI / 8, Math.PI / 8)
    
    
    this.sp += dsp
    this.theta += dtheta

    const [dx, dy] = DePolaresACartesianas(this.sp *ln, this.theta *ln)

    this.x += dx
    this.y += dy
    this.x = Clamp(0, this.x, this.x)
    this.y = Clamp(0,this.h, this.y)
    this.radio += dradio
    this.radio = Clamp(0, tamaxParticula, this.radio) * ln
    
    //gestion de spawn

    this.ttl += -1
    if (this.ttl == 0) {
      this.reset()
    }
  }
  Draw(CTX:CanvasRenderingContext2D) {
    CTX.save()
    this.experiment1(CTX)
    CTX.restore()
  }
  experiment1(CTX:CanvasRenderingContext2D) {
    CTX.fillStyle = this.color
    CTX.globalAlpha=this.alpha
    let circle = new Path2D()
    circle.arc(this.x, this.y, this.radio, 0, 2 * Math.PI)
    CTX.fill(circle)
  }
}
// constantes de la simulacion:
const totparciculas = 1000 //spawncap
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
  Update(imgData: ImageData) {
    //update particles
    this.particulas.forEach( p => p.Update(imgData))
    
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

function dibujameEsta(imgCtx: CanvasRenderingContext2D, width: number, height: number) {
  const updateFramerate = 50
  const renderFrametime =50

  const CANVAS = document.createElement('canvas')
  document.body.appendChild(CANVAS)

  if (!CANVAS) return

  CANVAS.width = width
  CANVAS.height = height

  const CTX = CANVAS.getContext('2d')

  if (!CTX) return
  CTX.imageSmoothingEnabled = true
  CTX.imageSmoothingQuality = 'high'

  const sim = new Simulation(width,height)
  const imgData = imgCtx.getImageData(0,0,width,height)
  setInterval(
    () => { sim.Update(imgData) },
    1000/updateFramerate
  )
  setInterval(
    () => { sim.Draw(CTX) },
    1000/renderFrametime
  )

}
function dualpic(salsa: string, width: number, height: number){
  const canvasImg = document.createElement('canvas')
  document.body.appendChild(canvasImg)
  canvasImg.width = width
  canvasImg.height = height
  const CTX = canvasImg.getContext('2d')
  if (!CTX) {
    return
  }

  //creamos un elemento imagen que subir
  var imagen = new window.Image()
  if (!imagen) {
    return
  }

  imagen.crossOrigin = 'Anonymous'
  imagen.onload = (e) => {
    CTX.drawImage(imagen, 0, 0, width, height)
    canvasImg.hidden=true
    dibujameEsta(CTX, width, height)
  }
  imagen.src = salsa
}

function bootstrapper() {
  const WIDTH = 800 
  const HEIGHT = 800

  var salsa="pic.png"

  dualpic(salsa, WIDTH, HEIGHT)
    
}

bootstrapper()