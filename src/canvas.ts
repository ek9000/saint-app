class vec2d
{
	x=0;
	y=0;
	constructor(x:number,y:number)
	{
		this.x = x;
		this.y = y;
		return;
	}
	
}

export function setupCanvas(element: HTMLCanvasElement,element_2:HTMLCanvasElement) {
    let width = 1024
    let height = 720
    let canvas_zoom = 1;
    let zoom_speed = 0.1;
    let points:Array<vec2d> = [];
    //let points:Array<number>[] = [];
    let i = 0;
    let isPenDown = false;
    let eraser = false;
    const ctx:CanvasRenderingContext2D = element.getContext('2d',{willReadFrequently:true})!;
    const ctx_ui:CanvasRenderingContext2D = element_2.getContext('2d')!;
    const bg = document.querySelector("#bg");
    bg.style.width = (width.toString()+"px");
    bg.style.height = (height.toString()+"px");
    let _stroke_size_range = document.querySelector("#stroke_size")!;
    let _stroke_size = 1;
    let _min_stroke_size_range = document.querySelector("#min_stroke_size")!;
    let _min_stroke_size = 0;
    let _stabilizer = document.querySelector("#stabilizer")!;
    let _stabilizer_value = 1;
    element.width = width;
    element.height = height;
    element_2.width = width;
    element_2.height = height;
    let _history:ImageData[] = [];
    let _history_id = 0;
    let lastPoint = { x: 0, y: 0 };
    let currentPoint = { x: 0, y: 0 };
    let draw_point = {x:0,y:0,size:0,direction:0}

    ctx.clearRect(0,0,width,height)
    ctx_ui.clearRect(0,0,width,height)
  
    _history[_history_id] = ctx.getImageData(0, 0,width, height)
    const _draw = (x: number,y:number,e:PointerEvent) =>
    {
        
        //if(!isPenDown)return;
        if(e == undefined)return;
        //console.log(e);
        if(e.buttons == 1){
            
          let rect = element.getBoundingClientRect();
           
        let f_x = x- rect.left;
        let f_y = y - rect.top;

        
        points.push({x:Math.round(f_x),y:Math.round(f_y)});
        //ctx.clearRect(0,0,width,height)
            if(i>1)
            {
              var p0 = points[i-2];
              var p1 = points[i-1];
              var p2 = points[i];
             
               ctx.beginPath();
               for(let j = 0;j<2;j++)
               {
                ctx.moveTo(p0.x, p0.y);
                let new_pressure = Math.max(e.pressure,_min_stroke_size/100)
                //ctx.lineTo(p2.x,p2.y);
                //let midpoint = midPointBtw(p1,p2)
                ctx.quadraticCurveTo(p1.x,p1.y,p2.x,p2.y)
                ctx.lineWidth = _stroke_size*new_pressure;
                ctx.lineCap = "round";
                p0 = points[j];
                p1 = points[j+1];
                p2 = points[j+2];
                if(p2==undefined)return;
                //ctx.fill();
               }
                ctx.lineTo(p2.x,p2.y)
               ctx.stroke();
               ctx.closePath();
                
               
                 
            }
            i++;
            
        }
        else
        {
           i=0;
           points.length = 0;

        }
        
    }

    const _draw_estabilizador = (x:number,y:number,pressure:number,erase:boolean = false) =>
    {
      if(!isPenDown)return;
      
      let rect = element.getBoundingClientRect();
           
      let f_x = x - rect.left;
      let f_y = y - rect.top;
      if(eraser){ctx.strokeStyle = "white"}
      else{ctx.strokeStyle = "red"}
      
      ctx.beginPath()
      
      
      let new_pressure = Math.max(pressure,_min_stroke_size/100) - 0.15
      
      for(let j = 0;j<10*(100-_stabilizer_value+1);j++)
      {

        draw_point.x += (f_x-draw_point.x)/1000
        draw_point.y += (f_y-draw_point.y)/1000
        draw_point.size +=  (_stroke_size*new_pressure - draw_point.size)/10000*(_min_stroke_size+1)
        draw_point.size<0?draw_point.size=0:{};
        //ctx.arc(draw_point.x,draw_point.y,draw_point.size,0,Math.PI*2,false);
        
        ctx.ellipse(draw_point.x,draw_point.y,draw_point.size,draw_point.size,360,0,360);
      }
      
      ctx.stroke();
      //ctx.fill;
      ctx.closePath();
    }

   //isPenDown

    document.addEventListener('pointerdown',(e) =>{
        
      let rect = element.getBoundingClientRect();
        isPenDown = true;
        draw_point.x = e.clientX- rect.left;
        draw_point.y = e.clientY- rect.top;
        draw_point.size = 0;
        lastPoint = { x: e.clientX, y: e.clientY };
        
        points.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    });
    //document.addEventListener('mousemove',(e) =>_draw(e.clientX ,e.clientY,e));
    document.addEventListener('pointermove',(e) =>
    {
        //_draw(e.clientX,e.clientY,e);
        _draw_estabilizador(e.clientX,e.clientY,e.pressure)
        ctx_ui.clearRect(0,0,width,height);
        ctx_ui.fillStyle = 'white';
        let rect = element_2.getBoundingClientRect();
        let rect_cont = document.getElementById("canvas_container")?.getBoundingClientRect();
        let f_x = e.clientX - rect.left ;
        let f_y = e.clientY - rect.top;
        //draw brush size
        //ctx_ui.lineWidth = 2;
        //ctx_ui.rect(0,0,500,500)
        ctx_ui.beginPath();
        ctx_ui.ellipse(f_x,f_y,_stroke_size*canvas_zoom,_stroke_size*canvas_zoom,360,0,360);
        
        ctx_ui.stroke();
        ctx_ui.beginPath();
        ctx_ui.ellipse(f_x,f_y,1,1,360,0,360);
        ctx_ui.stroke();
        
    //
    }
    );
  
   
    document.addEventListener('pointerup',(e) =>{
       if(isPenDown){
        //points.length = 0;
        _history[_history_id] = ctx.getImageData(0, 0,width, height)
        _history_id++;
        
        isPenDown = false;}
    });
   
    document.addEventListener('keydown',(e) =>{

        if(e.key == 'z' && e.ctrlKey )
        {
           
            if(_history_id>0){
               ctx.clearRect(0,0,width,height)
                
                _history_id--;
                if(_history[_history_id-1])
                ctx.putImageData(_history[_history_id-1],0,0);
                
            }
        }
        if(e.key == 'e')
        {
            if(!eraser)eraser = true;
            else eraser = false;
            return;
        }
    });

   document.addEventListener('contextmenu', event => event.preventDefault());

   //zoom
   document.addEventListener('wheel', e => {
    return;
   
    canvas_zoom += (e.deltaY/100)*zoom_speed;
    canvas_zoom<0.1?canvas_zoom = 0.1:{};
    console.log(canvas_zoom)
    document.querySelectorAll(".nocursor").forEach( el => {
      el.style.width = ((width*canvas_zoom).toString()+"px");
      el.style.height = ((height*canvas_zoom).toString()+"px");
      
    });
    document.querySelector("#canv_margin")!.style.width = (500/(1+canvas_zoom)).toString+"px";
    document.querySelector("#canv_margin")!.style.height = (500/(1+canvas_zoom)).toString+"px";
    //bg! = canvas_zoom
    
    
  });


   _stroke_size_range.addEventListener('change',(e) =>{
    _stroke_size = _stroke_size_range.value;
   })
   _min_stroke_size_range.addEventListener('change',(e) =>{
    _min_stroke_size = _min_stroke_size_range.value;
   })
   _stabilizer.addEventListener('change',(e) =>{
    _stabilizer_value = _stabilizer.value;
   })

   function distanceBetween(point1:vec2d, point2:vec2d) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  }
  function angleBetween(point1:vec2d, point2:vec2d) {
    return Math.atan2( point2.x - point1.x, point2.y - point1.y );
  }
  function midPointBtw(p1:vec2d, p2:vec2d) {
    return {
      x: p1.x + (p2.x - p1.x) / 2,
      y: p1.y + (p2.y - p1.y) / 2
    };
  }

  }


