var colorPosDataForTrajectory = [];

function drawTrajectory(iter){
console.log(colorPosDataForTrajectory[iter].length+"label");
  for(var i=0; i<colorPosDataForTrajectory[iter].length; i++){
  //alert(colorPosDataForTrajectory[iter][i].x+"xxxxxxx");
 // alert(colorPosDataForTrajectory[iter][i].g+"iterrrr");
    drawCircle(i, colorPosDataForTrajectory[iter]);
  }
}

//call once
function setTrajectory(){
//  var colorPosDataTmp = $.extend(true, {}, colorPosData);
  var colorPosDataTmp = [];
  for(var i=0; i<initColorPosData.length; i++){
    var cx = initColorPosData[i].x;
    var cy = initColorPosData[i].y;
    var cr = initColorPosData[i].r;
    var cnormG = initColorPosData[i].normG;
    var cnormB = initColorPosData[i].normB;
	var cid = initColorPosData[i].id;
    colorPosDataTmp.push(new makeColorPosData(cx, cy, cr, cnormG, cnormB, cid));
  }

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
    colorPosDataForTrajectory.push(colorPosDataTmp);
  }
  //alert("leng"+colorPosDataForTrajectory.length);
  //alert(colorPosDataForTrajectory[0].x);
}
