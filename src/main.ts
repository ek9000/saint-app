import './style.css'
import { setupCanvas } from './canvas.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  
  <div class="canvas_container">
  <div id="bg" style="background-color:white;"></div>
  <canvas id="canvas" class="nocursor"></canvas>
  <canvas id="canvas_ui" width="1240" height="720" class="nocursor"></canvas>
  </div>
  
  
`
setupCanvas(document.querySelector<HTMLCanvasElement>('#canvas')!,document.querySelector<HTMLCanvasElement>('#canvas_ui')!)

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
document.getElementsByClassName('nocursor')[0]
