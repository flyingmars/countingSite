
var currentBoxes       = [] ;
var currentBoxesIndex  = [] ;
var gCounting = 0 ;

window.addEventListener('contextmenu', function(evt) { 
  evt.preventDefault();
}, true);

$(document).ready(function(){
  var windowWidth    =  $(window).width()           ;
  var windowHeight   =  $(window).height()          ;
  var windowWHRatio  =  windowWidth/ windowHeight   ;
  var imageHeight    =  $('#target').height()       ;
  var imageWidth     =  $('#target').width()        ;
  var imageWHRatio   =  imageWidth / imageHeight    ;
  var imageFixWidth  =  0                           ;
  var imageFixHeight =  0                           ;
  var imageMarginLR  =  0                           ;
  var imageMarginUD  =  0                           ;
  
  console.log("windowWidth " + windowWidth + " windowHeight " + windowHeight);
  if ( imageWHRatio <= windowWHRatio ){
    imageFixWidth  =  windowHeight * imageWHRatio ;
    imageFixHeight =  windowHeight ;
    imageMarginLR  =  ( windowWidth - imageFixWidth ) / 2 ;
  }else{
    imageFixHeight   =  windowWidth / imageWHRatio ;
    imageFixWidth    =  windowWidth ;
    imageMarginUD    =  ( windowHeight - imageFixHeight ) / 2 ;
  }
  
  // Change the position of elements
  
  $('#target').height(imageFixHeight) ;
  $('#target').width(imageFixWidth)   ;
  $('#target').css("left"   ,imageMarginLR);
  $('#target').css("top"    ,imageMarginUD);
  
  $('#canvas-shadow').height(imageFixHeight) ;
  $('#canvas-shadow').width(imageFixWidth)   ;
  $('#canvas-shadow').css("left"   ,imageMarginLR);
  $('#canvas-shadow').css("top"    ,imageMarginUD);
  $('#canvas-shadow').attr('width' ,imageFixWidth);
  $('#canvas-shadow').attr('height',imageFixHeight);
  $('#canvas-shadow').width(imageFixWidth);
  $('#canvas-shadow').height(imageFixHeight);

  $('#canvas').height(imageFixHeight) ;
  $('#canvas').width(imageFixWidth)   ;
  $('#canvas').css("left"   ,imageMarginLR);
  $('#canvas').css("top"    ,imageMarginUD);
  $('#canvas').attr('width' ,imageFixWidth);
  $('#canvas').attr('height',imageFixHeight);
  $('#canvas').width(imageFixWidth);
  $('#canvas').height(imageFixHeight);
  
  $('#counting-object').height(imageFixHeight) ;
  $('#counting-object').width(imageFixWidth)   ;
  $('#counting-object').css("left"   ,imageMarginLR);
  $('#counting-object').css("top"    ,imageMarginUD);
  
  $('#button-send').height(windowHeight/8);
  $('#button-send').width ( (imageMarginLR == 0) ? 100 : imageMarginLR );
  $('#button-send').css('line-height',windowHeight/8 +"px"); 
  $('#button-send').draggable();
  
  
  $('#info-box').width ( (imageMarginLR - 10 <= 0 ) ? 400 : (imageMarginLR - 10));
  $('#info-box').css("top", $('#button-send').height() + "px" );
  $('#info-box').draggable();
  

  
  // Bind KeyPress
  $(window)
  .keydown(function(event){
    if ( event.which == 17 ){
      $('#canvas-shadow').hide();
    }
  })
  .keyup(function(event){
    if ( event.which == 17 ){
      $('#canvas-shadow').show();
    }
  });

  
  // Bind Mouse
  var mouseDownX = 0 ;
  var mouseDownY = 0 ;
  var offset     = $('#canvas-shadow').offset() ;
  var isDown     = false ;
  var isDrag     = false ;
    
  $('#canvas-shadow')
  .mousedown(function(e){
    if ( e.button == 2 ){
      return ;
    }
    if ( !isDrag ){      
      isDown = true ;
      mouseDownX = e.pageX - offset.left ;
      mouseDownY = e.pageY - offset.top  ;
      $("#span-ul-x").text( Math.round(mouseDownX));
      $("#span-ul-y").text( Math.round(mouseDownY));
      $("#span-ul-xp").text( Math.round(mouseDownX / imageFixWidth  * 10000 ) / 100);
      $("#span-ul-yp").text( Math.round(mouseDownY / imageFixHeight * 10000 ) / 100);
    }
  })
  .mousemove(function(e){
    if ( isDown ){
      isDrag = true ;
      drawShadowCanvasRectangle(mouseDownX,mouseDownY,e,offset,imageFixWidth,imageFixHeight);
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
      
      if ( rectWidth == 0 || rectHeight == 0 )
        return ;
      
      var record = {
        x : (mouseDownX + mouseUpX)/2 / imageFixWidth  , // Midpoint of X of rect (%) 
        y : (mouseDownY + mouseUpY)/2 / imageFixHeight , // Midpoint of Y of rect (%) 
        width  : rectWidth  / imageFixWidth  ,
        height : rectHeight / imageFixHeight ,
      };
      currentBoxes.push(record) ;
      currentBoxesIndex.push(gCounting) ;
      
      gCounting++ ;
      reDrawUnderCanvas();
      appendAnClickableObject() ;
      
    }
  })  ; // canvas-shadow
  
}); // ready

function appendAnClickableObject(){
  var idNew = "counting-obj-" + currentBoxesIndex[currentBoxesIndex.length-1] ;
  var sharpIDNew = "#" + idNew ;
  
  $("#counting-object").append('<div id="'+ idNew + '"></div>');
  var imageHeight = $('#target').height() ;
  var imageWidth  = $('#target').width()  ;
  
  var lastBoxes = currentBoxes[currentBoxes.length-1] ;
  var leftUpPointX = ( lastBoxes.x - lastBoxes.width  / 2 ) * imageWidth  ;
  var leftUpPointY = ( lastBoxes.y - lastBoxes.height / 2 ) * imageHeight ;
  var width   = lastBoxes.width  * imageWidth  ;
  var height  = lastBoxes.height * imageHeight ;
  $("#span-count").text(currentBoxes.length);
  
  $(sharpIDNew).css("position","absolute");
  $(sharpIDNew).css("left",leftUpPointX);
  $(sharpIDNew).css("top",leftUpPointY);
  $(sharpIDNew).css("width",width);
  $(sharpIDNew).css("height",height);
  $(sharpIDNew).mousedown(function(e){
    if ( e.button != 2 )
      return ;
    
    var idToDelete = $(sharpIDNew).attr("id").match(/counting-obj-(\d+)/);
    console.log("idToDelete = " + idToDelete ) ;
    if ( idToDelete != null ){
      var indexOfElementToDelete = currentBoxesIndex.indexOf(parseInt(idToDelete[1])) ;
      if ( indexOfElementToDelete >= 0 ){
        currentBoxesIndex.splice(indexOfElementToDelete,1);
        currentBoxes.splice(indexOfElementToDelete,1);
        console.log("indexOfElementToDelete = " + indexOfElementToDelete ) ;
        $("#span-count").text(currentBoxes.length);
        reDrawUnderCanvas();
      }
      $(sharpIDNew).remove() ;
    }
    
  }); //mouseDown

}

function reDrawUnderCanvas(){
  var underCanvas = document.getElementById('canvas');
  var ctx = underCanvas.getContext('2d');
  ctx.clearRect(0,0,underCanvas.width,underCanvas.height);
  ctx.strokeStyle = '#e60033' ;
  ctx.lineWidth   = 2 ;

  var imageHeight = $('#target').height() ;
  var imageWidth  = $('#target').width()  ;
  
  console.log("Canvas Len = " + currentBoxes.length ) ;
  for(var i = 0; i< currentBoxes.length ; i++ ){
    var leftUpPointX = ( currentBoxes[i].x - currentBoxes[i].width  / 2 ) * imageWidth  ;
    var leftUpPointY = ( currentBoxes[i].y - currentBoxes[i].height / 2 ) * imageHeight ;
    var width   = currentBoxes[i].width  * imageWidth  ;
    var height  = currentBoxes[i].height * imageHeight ;
    ctx.strokeRect(leftUpPointX,leftUpPointY,width,height);
  }

}


function drawShadowCanvasRectangle(initX,initY,event,offset,imageFixWidth,imageFixHeight){
  
    var shadowCanvas = document.getElementById('canvas-shadow');
    var ctx = shadowCanvas.getContext('2d');
    ctx.clearRect(0,0,shadowCanvas.width,shadowCanvas.height);
    ctx.beginPath();
    var lastX = event.pageX - offset.left ;
    var lastY = event.pageY - offset.top  ;
    var rectWidth  = -(initX - lastX) ;
    var rectHeight = -(initY - lastY) ;
    
    ctx.rect(initX,initY,rectWidth,rectHeight);
    ctx.strokeStyle = '#98d98e' ;
    ctx.lineWidth   = 3 ;
    ctx.stroke() ;
    
    $("#span-br-x").text( Math.round(lastX));
    $("#span-br-y").text( Math.round(lastY));  
    $("#span-br-xp").text( Math.round(lastX / imageFixWidth  * 10000 ) / 100);
    $("#span-br-yp").text( Math.round(lastY / imageFixHeight * 10000 ) / 100);
    
    setTimeout(function(){
      ctx.clearRect(0,0,shadowCanvas.width,shadowCanvas.height);
    },1000);
}


