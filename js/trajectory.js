var colorPosDataForTrajectory = [];

function drawTrajectory(iter){
  var iterIndex = iter;
  if(colorPosDataForTrajectory.length <= iter){ 
    iterIndex = colorPosDataForTrajectory.length - 1;
  }
  for(var i=0; i<colorPosDataForTrajectory[iterIndex].length; i++){
    drawCircle(colorPosDataForTrajectory[iterIndex][i]);
  }
}

//call once
function setTrajectory(){
  function copyColorPosData(argColorPosData){
    var colorPosDataTmp = [];
    console.log(argColorPosData.length)
    for(var i=0; i<argColorPosData.length; i++){
      var cx = argColorPosData[i].x;
      var cy = argColorPosData[i].y;
      var cr = argColorPosData[i].r;
      var cG = argColorPosData[i].g;// normG
      var cB = argColorPosData[i].b;
      var cid = argColorPosData[i].id;
	    console.log(cG + "," + cB + "sssss"); // undifined
      colorPosDataTmp.push(new makeColorPosData(cx, cy, cr, cG, cB, cid));
    }
	  return colorPosDataTmp;
	}

  colorPosDataForTrajectory.push(copyColorPosData(initialInterface));

  var colorPosDataTmp = copyColorPosData(initialInterface);
   
  //var colorPosDataTmp = colorPosData;
  for(let i = 0; i < interfaceHistory.length; i++){
    var interface = interfaceHistory[i];
    for(var j = 0; j < colorPosDataTmp.length; j++){
      if(colorPosDataTmp[j].id == interface.id){
	      colorPosDataTmp[j].x = interface.x;
        colorPosDataTmp[j].y = interface.y;
	    }
    }
    colorPosDataForTrajectory.push(copyColorPosData(colorPosDataTmp));
  }
}
