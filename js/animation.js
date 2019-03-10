function playAnime(){
  if(typeof leftFlag === "undefined" || leftFlag === false){
    alert("答え合わせボタンを押す前に決定ボタンを押してください");
    return;
  }
  resMap = JSON.parse(getLearn());
  if(!resMap["success"]){
    alert("データ受信エラー");
    return;
  }
  // 描画回数
  var loopNum = clusterMeanHistory.length;
  if(loopNum < resMap["iters"]){
    loopNum = resMap["iters"];
  }
  loop(0, loopNum);
}

/*
ループ関数, 1000ms毎にloopContentの処理を行う．
iは繰り返しのカウンターの初期値
endCountはカウンターの最後の値
=====以下のコードと同様の動きをします=====
    for(n=i, n <= endCount; n++){
        loopContent();   //上にあるこの関数内にループさせたい処理を書いてください．
        sleep(1000);
    }
*/
function loop(i, endCount){
  if(i <= endCount){
    loopContent(i);
    setTimeout(function(){loop(++i, endCount)}, 1000);
  }
}

/* ここにloop関数でループさせる内容を書いてください． */
function loopContent(i){
  context.clearRect(0, 0, lCanvas.width, lCanvas.height);
  rContext.clearRect(0, 0, rCanvas.width, rCanvas.height);
  // 軸の描画
  drawLeftAxis();
  drawRightAxis();
  // 左画面描画
  drawTrajectory(ColorInterface.getTrajectory(initialInterface, interfaceHistory), i);
  // 右画面描画
  plotDataPoint(getCoordinatesAtRightPanel(initialInterface), i); // データ点
  plotClusterCenter(i); // クラスタ中心
  plotClusterCenterHistory(clusterMeanHistory, i, 0); // ユーザーのクラスタ中心
}

// interfaceArrayを入れると、dataPointを生成する
function getCoordinatesAtRightPanel(arr){
  var dataPoint = [];
  for(let i = 0; i < arr.length; i++){
    dataPoint.push({
      x: arr[i].g*(rCanvas.width*0.8) + rCanvas.width*0.1,
      y: rCanvas.height*(1 - 0.1) - arr[i].b*(rCanvas.height*0.8),
      g: arr[i].getIntG(),
      b: arr[i].getIntB(),
      id: arr[i].id,
    });
  }
  return dataPoint;
}

// 軌跡データを左画面に描画
function drawTrajectory(traArray, iter){
  var iterIndex = traArray.length <= iter ? traArray.length-1 : iter;
  for(let key in traArray[iterIndex]){
    drawCircle(traArray[iterIndex][key]);
  }
}

// データポイントのプロット関数
function plotDataPoint(dataPoint, t){
  var resultIndex = t - 1;
  // ユーザーの動かした回数がクラスタリングのイテレーションよりも多い場合はそれに合わせる
  if(resultIndex >= resMap["iters"]){
    resultIndex = resMap["iters"] - 1;
  }
  if(resultIndex === -1){
    for(var i=0; i<dataPoint.length; i++){
      drawRightPCircle(dataPoint[i].x, dataPoint[i].y, dataPoint[i].g, dataPoint[i].b);
    }
  }else{
    for(var i=0; i<dataPoint.length; i++){
      var clusterLabel = resMap["result"][resultIndex]["allocation"][dataPoint[i].id]
      var g = Math.round(resMap["result"][resultIndex]["centroid"][clusterLabel]["x"] * 255);
      var b = Math.round(resMap["result"][resultIndex]["centroid"][clusterLabel]["y"] * 255);
      drawRightPCircle(dataPoint[i].x, dataPoint[i].y, g, b);
    }
  }
}

// データアイコン
function drawRightPCircle(x, y, colorG, colorB, roundColorG, roundColorB){
  // 円を塗りつぶす
  rContext.fillStyle = 'rgba('+fixedR+','+colorG+','+colorB+',1)';
  rContext.beginPath();
  rContext.arc(x, y, rightRadius, 0, Math.PI*2, false);
  rContext.fill();

  // 円の縁取り
  rContext.lineWidth = 1;
  rContext.strokeStyle = 'rgba(128,'+ roundColorG +','+ roundColorB+',1)';
  rContext.beginPath();
  rContext.arc(x, y, rightRadius, 0, Math.PI*2, false);
  rContext.stroke();
}

// クラスタアイコン
function drawRightCCircle(x, y, colorG, colorB, roundColorG, roundColorB){
  // 円を塗りつぶす
  rContext.fillStyle = 'rgba('+fixedR+','+colorG+','+colorB+',1)';
  rContext.beginPath();
  rContext.arc(x, y, rightRadius, 0, Math.PI*2, false);
  rContext.fill();

  // 円の縁取り
  rContext.lineWidth = 5;
  rContext.strokeStyle = 'rgba(128,'+ roundColorG +','+ roundColorB+',1)';
  rContext.beginPath();
  rContext.arc(x, y, rightRadius-10, 0, Math.PI*2, false);
  rContext.stroke();

  rContext.lineWidth = 1;
  rContext.strokeStyle = 'rgba(128,'+ roundColorG +','+ roundColorB+',1)';
  rContext.beginPath();
  rContext.arc(x, y, rightRadius, 0, Math.PI*2, false);
  rContext.stroke();
}

function plotClusterCenter(t){
  if(t == 0){return;}
  var resultIndex = t - 1;
  if(resultIndex+1 >= resMap["iters"]){resultIndex = resMap["iters"]-2;}

  var clusterNum = resMap["result"][resultIndex]["centroid"].length;
  var centroid = [];

  for(var i=0; i<clusterNum; i++){
    var g = resMap["result"][resultIndex]["centroid"][i]["x"];
    var b = resMap["result"][resultIndex]["centroid"][i]["y"];
    centroid.push(new ColorInterface(null, null, i, null, fixedR, g, b));
  }
  var centroid = getCoordinatesAtRightPanel(centroid);
  for(var i=0; i<clusterNum; i++){
    drawRightCCircle(centroid[i].x, centroid[i].y, centroid[i].g, centroid[i].b);
  }
}

/*
点を打つ関数
x,yには0から255の間の値を入れてください．
markerは0から4までの数字を選んでください(0:✕, 1:○, 2:●, 3:□, 4:■)
colorは0から5までの数字を選んでください(0:シアン, 1:マゼンタ, 2:イエロー, 3:グリーン, 4:ブルー, 5:レッド)
*/
function plotDot(x, y, marker, color){
  var size = 10;

  /*数値であるか判定*/
  if(x == null || y == null || isNaN(x) || isNaN(y)) return;

  /*キャンバスの端を10%余白として0から255の値をキャンバスに書くための変換*/
  x = x*((rCanvas.width*0.8)/255) + (rCanvas.width*0.1);
  y = y*((rCanvas.height*0.8)/255) + (rCanvas.height*0.1);
  y = rCanvas.height - y; //上下反転変換

  /*色を指定*/
  if(color == 0) color = 'rgb(0, 255, 255)';
  else if(color == 1) color = 'rgb(255, 0, 255)';
  else if(color == 2) color = 'rgb(255, 255, 0)';
  else if(color == 3) color = 'rgb(0, 255, 0)';
  else if(color == 4) color = 'rgb(0, 0, 255)';
  else if(color == 5) color = 'rgb(255, 0, 0)';
  else{
      console.log('error : color is not ploper in this program plotDot')
  }

    /*マーカーを指定して描画*/
  if(marker == 0) drawCrossDot();
  else if(marker == 1) drawStrokeCircleDot();
  else if(marker == 2) drawFillCircleDot();
  else if(marker == 3) drawStrokeSquareDot();
  else if(marker == 4) drawFillSquareDot();
  else{
      console.log("error : marker is not proper in this program plotDot");
      return;
  }

  function drawCrossDot(){
      rContext.beginPath();
      rContext.strokeStyle = color;
      rContext.moveTo(x-size/2, y-size/2);
      rContext.lineTo(x+size/2, y+size/2);
      rContext.stroke();
      rContext.moveTo(x-size/2, y+size/2);
      rContext.lineTo(x+size/2, y-size/2);
      rContext.stroke();
  }
  function drawStrokeCircleDot(){
      rContext.beginPath();
      rContext.strokeStyle = color;
      rContext.arc(x, y, size/2, 0, Math.PI*2, false);
      rContext.stroke();
  }
  function drawFillCircleDot(){
      rContext.beginPath();
      rContext.fillStyle = color;
      rContext.arc(x, y, size/2, 0, Math.PI*2, false);
      rContext.fill();
  }
  function drawStrokeSquareDot(){
      rContext.beginPath();
      rContext.strokeStyle = color;
      rContext.strokeRect(x-size/2, y-size/2, size, size);
  }
  function drawFillSquareDot(){
      rContext.beginPath();
      rContext.fillStyle = color;
      rContext.fillRect(x-size/2, y-size/2, size, size);
  }
}

/*
numに指定した回数分のクラスタ中心の履歴をplotする関数
numに0を指定したときは更新回数0(つまり初期状態)をプロットします．
numに1を指定したときは0回目と1回目のクラスタ中心をプロットします．
numに2を指定したときは0回目と1回目と2回目のクラスタ中心をプロットします．
numに3を指定したときは0回目と1回目と2回目と3回目のクラスタ中心をプロットします．
    ... 以下同様
*/
function plotClusterCenterHistory(dotHistory, num, marker){
  var i, n;
  if(num > dotHistory.length - 1){
    num = dotHistory.length - 1; //表示回数がデータの表示できる回数分より大きかった場合はそこで打ち切る
  }
  /*データの表示*/
  for(j = num; j < num + 1; j++){
    const element = clusterMeanHistory[j];
    for (const key in element) {
      plotDot(element[key].g,
              element[key].b,
              marker, key);
    }
  }
}
