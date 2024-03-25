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
    let width = 1240
    let height = 720
    let points:Array<vec2d> = [];
    //let points:Array<number>[] = [];
    let i = 0;
    let isPenDown = false;
    const ctx:CanvasRenderingContext2D = element.getContext('2d',{willReadFrequently:true})!;
    const ctx_ui:CanvasRenderingContext2D = element_2.getContext('2d')!;
    let _stroke_size_range = document.querySelector("#stroke_size")!;
    let _stroke_size = 1;
    let _min_stroke_size_range = document.querySelector("#min_stroke_size")!;
    let _min_stroke_size = 0;
    element.width = width;
    element.height = height;
    element_2.width = width;
    element_2.height = height;
    let _history:ImageData[] = [];
    let _history_id = 0;
    let lastPoint = { x: 0, y: 0 };
    let currentPoint = { x: 0, y: 0 };


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
        
            if(i>0)
            {
              var p1 = points[i-1];
              var p2 = points[i];
               ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                let new_pressure = Math.max(e.pressure,_min_stroke_size/100)
                ctx.lineTo(p2.x,p2.y);
                       
                ctx.lineWidth = _stroke_size*new_pressure;
                ctx.lineCap = "round";
           
                ctx.stroke();
               
                 
            }
            i++;
            
        }
        else
        {
           i=0;
           points.length = 0;

        }
        
    }

   //isPenDown

    document.addEventListener('pointerdown',(e) =>{
        
        isPenDown = true;
        lastPoint = { x: e.clientX, y: e.clientY };
        let rect = element.getBoundingClientRect();
        points.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    });
    //document.addEventListener('mousemove',(e) =>_draw(e.clientX ,e.clientY,e));
    document.addEventListener('pointermove',(e) =>
    {
        _draw(e.clientX,e.clientY,e);
        ctx_ui.clearRect(0,0,width,height);
        ctx_ui.fillStyle = 'white';
        let rect = element_2.getBoundingClientRect();
        let f_x = e.clientX - rect.left;
        let f_y = e.clientY - rect.top;
        //draw brush size
        //ctx_ui.lineWidth = 2;
        //ctx_ui.rect(0,0,500,500)
        ctx_ui.beginPath();
        ctx_ui.ellipse(f_x,f_y,_stroke_size,_stroke_size,360,0,360);
        
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
        console.log(_history_id);
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
                console.log(_history[_history_id]);
            }
        }
    });

   document.addEventListener('contextmenu', event => event.preventDefault());

   _stroke_size_range.addEventListener('change',(e) =>{
    _stroke_size = _stroke_size_range.value;
   })
   _min_stroke_size_range.addEventListener('change',(e) =>{
    _min_stroke_size = _min_stroke_size_range.value;
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


