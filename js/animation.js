function playAnime(){
  if(!leftFlag){
    alert("答え合わせボタンを押す前に決定ボタンを押してください");
    return;
  }
  resMap = JSON.parse(getLearn());
  if(!resMap["success"]){
    alert("データ受信エラー");
    return;
  }
  // 描画回数の設定
  var loopNum = Math.max(clusterMeanHistory.length, resMap["iters"]);
  // 描画開始
  loop(0, loopNum, 1000);
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
function loop(i, endCount, delay){
  if(i <= endCount){
    loopContent(i);
    setTimeout(function(){loop(++i, endCount, delay)}, delay);
  }
}

/* ここにloop関数でループさせる内容を書いてください． */
function loopContent(i){
  clearPanel(lCanvas);
  clearPanel(rCanvas);
  // 左画面描画
  var trajectory = ColorInterface.getTrajectory(initialInterface, interfaceHistory);
  drawLeftAxis(); // 左画面の軸の描画
  drawTrajectory(trajectory, i); // インターフェイスの履歴描画
  // 右画面描画
  drawRightAxis(); // 右画面の軸の描画
  plotDataPoint(getCoordinatesAtRightPanel(rCanvas, initialInterface), i); // データ点
  plotClusterCenter(i); // クラスタ中心
  plotClusterCenterHistory(clusterMeanHistory, i, 0); // ユーザーのクラスタ中心
}

// TODO: 将来的にはdataPointもColorInterfaceで構成したい
// interfaceArrayを入れると、dataPointを生成する
function getCoordinatesAtRightPanel(canvas, interfaceArray){
  var dataPoint = [];
  for(let i = 0; i < interfaceArray.length; i++){
    const ele = interfaceArray[i];
    dataPoint.push({
      x: ele.g*(canvas.width*0.8) + canvas.width*0.1,
      y: canvas.height*(1 - 0.1) - ele.b*(canvas.height*0.8),
      g: ele.getIntG(),
      b: ele.getIntB(),
      id: ele.id,
    });
  }
  return dataPoint;
}

// 軌跡データを左画面に描画
function drawTrajectory(traArray, iter){
  //TODO: この行が正しく動くはまだチェックしてない
  var iterIndex = Math.min(traArray.length - 1, iter);
  for(let key in traArray[iterIndex]){
    const obj = traArray[iterIndex][key];
    drawCircle(lContext, obj.x, obj.y, fixedR, obj.getIntG(), obj.getIntB(), radius);
  }
}

// データポイントのプロット関数
function plotDataPoint(dataPoint, t){
  // ユーザーの動かした回数がクラスタリングのイテレーションよりも多い場合はそれに合わせる
  var resultIndex = Math.min(t, resMap["iters"]);
  for(var i=0; i<dataPoint.length; i++){
    const obj = dataPoint[i];
    var g = obj.g;
    var b = obj.b;
    if(resultIndex > 0){
      var clusterLabel = resMap["result"][resultIndex-1]["allocation"][obj.id];
      g = Math.round(resMap["result"][resultIndex-1]["centroid"][clusterLabel]["x"] * 255);
      b = Math.round(resMap["result"][resultIndex-1]["centroid"][clusterLabel]["y"] * 255);  
    }
    drawCircle(rContext, obj.x, obj.y, fixedR, g, b, rightRadius);
  }
}

// クラスタアイコンの描画
function drawClusterIcon(context, x, y, r, g, b, radius){
  context.lineWidth = 5;
  context.strokeStyle = 'rgba(0, 0, 0,1)';
  context.beginPath();
  context.arc(x, y, radius-10, 0, Math.PI*2, false);
  context.stroke();
}

function plotClusterCenter(t){
  if(t == 0){
    return;
  }
  var res = Math.min(t, resMap["iters"] - 1);
  var clusterNum = resMap["result"][res-1]["centroid"].length;
  var centroids = [];

  for(var i=0; i<clusterNum; i++){
    var g = resMap["result"][res-1]["centroid"][i]["x"];
    var b = resMap["result"][res-1]["centroid"][i]["y"];
    centroids.push(new ColorInterface(null, null, i, null, fixedR, g, b));
  }
  centroids = getCoordinatesAtRightPanel(rCanvas, centroids);
  for(var i=0; i<clusterNum; i++){
    const obj = centroids[i];
    drawCircle(rContext, obj.x, obj.y, fixedR, obj.g, obj.b, rightRadius);
    drawClusterIcon(rContext, obj.x, obj.y, fixedR, obj.g, obj.b, rightRadius);
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
      rContext.lineWidth = 1;
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
      rContext.lineWidth = 1;
      rContext.beginPath();
      rContext.strokeStyle = color;
      rContext.arc(x, y, size/2, 0, Math.PI*2, false);
      rContext.stroke();
  }
  function drawFillCircleDot(){
      rContext.lineWidth = 1;
      rContext.beginPath();
      rContext.fillStyle = color;
      rContext.arc(x, y, size/2, 0, Math.PI*2, false);
      rContext.fill();
  }
  function drawStrokeSquareDot(){
      rContext.lineWidth = 1;
      rContext.beginPath();
      rContext.strokeStyle = color;
      rContext.strokeRect(x-size/2, y-size/2, size, size);
  }
  function drawFillSquareDot(){
      rContext.lineWidth = 1;
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
  if(num > dotHistory.length - 1){
    num = dotHistory.length - 1; //表示回数がデータの表示できる回数分より大きかった場合はそこで打ち切る
  }
  /*データの表示*/
  for(j = num; j < num + 1; j++){
    const element = clusterMeanHistory[j];
    for (const key in element) {
      plotDot(element[key].g, element[key].b, marker, key);
    }
  }
}
