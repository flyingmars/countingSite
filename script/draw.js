
var currentBoxes = [] ;



$(document).ready(function(){
  var imageHeight = $('#target').height() ;
  var imageWidth  = $('#target').width()  ;
  $('#canvas-shadow').attr('width' ,imageWidth);
  $('#canvas-shadow').attr('height',imageHeight);
  $('#canvas-shadow').width("auto");
  $('#canvas-shadow').height("100%");
  $('#canvas').attr('width' ,imageWidth);
  $('#canvas').attr('height',imageHeight);
  $('#canvas').width("auto");
  $('#canvas').height("100%");  

  var mouseDownX = 0 ;
  var mouseDownY = 0 ;
  var offset     = $('#canvas-shadow').offset() ;
  var isDown     = false ;
  var isDrag     = false ;
    
  $('#canvas-shadow')
  .mousedown(function(e){
    if ( !isDrag ){      
      isDown = true ;
      mouseDownX = e.pageX - offset.left ;
      mouseDownY = e.pageY - offset.top  ;
    }
    
    console.log("Down X = " + (mouseDownX) + " Y = " + (mouseDownY) ); 
  })
  .mousemove(function(e){
    if ( isDown ){
      isDrag = true ;
      drawShadowCanvasRectangle(mouseDownX,mouseDownY,e,offset);
    }
  })
  .mouseup(function(e){
    if (isDown && isDrag) {
      isDown = false ;
      isDrag = false ;
      var mouseUpX    = e.pageX - offset.left ;
      var mouseUpY    = e.pageY - offset.top  ;
      var rectWidth   = Math.abs(mouseUpX-mouseDownX);
      var rectHeight  = Math.abs(mouseUpY-mouseDownY);
      
      var record = {
        x : (mouseDownX + mouseUpX)/2 /imageWidth  , // Midpoint of X of rect (%) 
        y : (mouseDownY + mouseUpY)/2 /imageHeight , // Midpoint of Y of rect (%) 
        width  : rectWidth  / imageWidth  ,
        height : rectHeight / imageHeight ,
      };
      
      currentBoxes.push(record) ;
      console.log("Up   X = " + (mouseUpX) + " Y = " + (mouseUpY)); 
      
      reDrawUnderCanvas();
    }
  })  ; // canvas
  
}); // ready


function reDrawUnderCanvas(){
  var underCanvas = document.getElementById('canvas');
  var ctx = underCanvas.getContext('2d');
  ctx.clearRect(0,0,underCanvas.width,underCanvas.height);
  
  var imageHeight = $('#target').height() ;
  var imageWidth  = $('#target').width()  ;
  
  for(var i = 0; i< currentBoxes.length ; i++ ){
    var leftUpPointX = ( currentBoxes[i].x - currentBoxes[i].width  / 2 ) * imageWidth  ;
    var leftUpPointY = ( currentBoxes[i].y - currentBoxes[i].height / 2 ) * imageHeight ;
    var width   = currentBoxes[i].width  * imageWidth  ;
    var height  = currentBoxes[i].height * imageHeight ;
    ctx.rect(leftUpPointX,leftUpPointY,width,height);
  }
  ctx.strokeStyle = '#00a381' ;
  ctx.lineWidth   = 3 ;
  ctx.stroke() ;
}


function drawShadowCanvasRectangle(initX,initY,event,offset){
  var shadowCanvas = document.getElementById('canvas-shadow');
  var ctx = shadowCanvas.getContext('2d');
  ctx.clearRect(0,0,shadowCanvas.width,shadowCanvas.height);
  ctx.beginPath();
  var lastX = event.pageX - offset.left ;
  var lastY = event.pageY - offset.top  ;
  var rectWidth  = -(initX - lastX) ;
  var rectHeight = -(initY - lastY) ;
  
  ctx.rect(initX,initY,rectWidth,rectHeight);
  ctx.strokeStyle = 'black' ;
  ctx.lineWidth   = 5 ;
  ctx.stroke() ;
}


