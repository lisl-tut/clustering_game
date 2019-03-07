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

function makeColorPosData(x, y, r, normG, normB, i){
  this.x = x; // 左画面においてのx座標
  this.y = y; // 左画面においてのy座標
  this.normG = normG; // 元データ（正規化されている）
  this.normB = normB; // 元データ（正規化されている）
  this.r = r; // 赤：とりあえず固定
  this.g = Math.round(this.normG*255); // 色データへ変換
  this.b = Math.round(this.normB*255); // 色データへ変換
  this.clusterLabel; // ユーザが設定する所属クラスタへのラベル
  this.id = i;  // データの通し番号（解答時のアニメーションに使用）
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
