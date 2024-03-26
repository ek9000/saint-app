import './style.css'
import { setupCanvas } from './canvas.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  
  <div class="canvas_container">
  <div id="canv_margin"></div>
  <div id="bg" style="background-color:white;" class="nocursor"></div>
  <canvas id="canvas" class="nocursor"></canvas>
  <canvas id="canvas_ui" ></canvas>
  </div>
  
  
`
setupCanvas(document.querySelector<HTMLCanvasElement>('#canvas')!,document.querySelector<HTMLCanvasElement>('#canvas_ui')!)

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
document.getElementsByClassName('nocursor')[0]

