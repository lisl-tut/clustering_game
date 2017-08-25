var colorPosDataForTrajectory = [];

function drawTrajectory(iter){
  var iterIndex = iter;
  if(colorPosDataForTrajectory.length <= iter){ 
    iterIndex = colorPosDataForTrajectory.length - 1;
  }

console.log(colorPosDataForTrajectory[iterIndex].length+"label");
  for(var i=0; i<colorPosDataForTrajectory[iterIndex].length; i++){
  //alert(colorPosDataForTrajectory[iter][i].x+"xxxxxxx");
 // alert(colorPosDataForTrajectory[iter][i].g+"iterrrr");
    drawCircle(i, colorPosDataForTrajectory[iterIndex]);
  }
  //alert("tettttttttttt");
}

//call once
function setTrajectory(){
    function copyColorPosData(argColorPosData){
	  var colorPosDataTmp = [];
      for(var i=0; i<argColorPosData.length; i++){
        var cx = argColorPosData[i].x;
        var cy = argColorPosData[i].y;
        var cr = argColorPosData[i].r;
        var cG = argColorPosData[i].g/255.0;// normG
        var cB = argColorPosData[i].b/255.0;
	    var cid = argColorPosData[i].id;
	    console.log(cG + "," + cB + "sssss"); // undifined

        colorPosDataTmp.push(new makeColorPosData(cx, cy, cr, cG, cB, cid));
      }
	  return colorPosDataTmp;
	}

   colorPosDataForTrajectory.push(copyColorPosData(initColorPosData));

   var colorPosDataTmp = copyColorPosData(initColorPosData);
   
  //var colorPosDataTmp = colorPosData;
  for(var i = 0; i < userOprHistory.length; i++){
    for(var j = 0; j < colorPosDataTmp.length; j++){
	
      if(colorPosDataTmp[j].id == userOprHistory[i].id){
	 // alert("ifbuaaaaaaaaaaaaaa");
        colorPosDataTmp[j].x = userOprHistory[i].x;
        colorPosDataTmp[j].y = userOprHistory[i].y;
		//colorPosDataTmp[j].g = userOprHistory[i].g;
        //colorPosDataTmp[j].b = userOprHistory[i].b;
      }
    }
	console.log(colorPosDataTmp[0].x+"xxx");

    colorPosDataForTrajectory.push(copyColorPosData(colorPosDataTmp));
	
  }
  //alert("leng"+colorPosDataForTrajectory.length);
  //alert(colorPosDataForTrajectory[0].x);
}
