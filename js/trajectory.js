var colorPosDataForTrajectory = [];

function drawTrajectory(iter){
  for(var i=0; i<colorPosDataForTrajectory[iter].length; i++){
    drawCircle(i, colorPosDataForTrajectory);
  }
}

//call once
function setTrajectory(){
  var colorPosDataTmp = $.extend(true, {}, colorPosData);
  for(var i = 0; i < userOprHistory.length; i++){
    for(var j = 0; j < colorPosDataTmp; j++){
      if(colorPosDataTmp[j] == userOprHistory[i].id){
        colorPosDataTmp[j].x = userOprHistory[i].x;
        colorPosDataTmp[j].y = userOprHistory[i].y;
      }
    }
    colorPosDataForTrajectory.push(colorPosDataTmp);
  }
}
