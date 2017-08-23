function makeColorPosData(x, y, r, normG, normB){
  this.x = x; // 左画面においてのx座標
  this.y = y; // 左画面においてのy座標
  this.normG = normG; // 元データ（正規化されている）
  this.normB = normB; // 元データ（正規かされている）
  this.r = r; // 赤：とりあえず固定
  this.g = Math.round(this.normG*255); // 色データへ変換
  this.b = Math.round(this.normB*255); // 色データへ変換
  this.clusterLabel; // ユーザが設定する所属クラスタへのラベル
}

function makeUserClusterCenter(){
  this.g = NaN;
  this.b = NaN;
}

function makeUserHistory(id, g, b){
  this.id = NaN; // クラスタラベル
  this.g = NaN;
  this.b = NaN;
}

function init() {
  // ユーザー用オブジェクト生成
  
  // JSONデータを配列へ
  //var testJson = "[[0.4803801741129671,0.6127016113967985],[0.9584773624254441,0.10916578463266124]]";
  // JSONデータがないときは線を引くだけ
  //if(typeof testJson === "undefined" || testJson == ""){repaint();return;}
  if(typeof json_str === "undefined" || json_str == ""){repaint();return;}
  //var gbArray = JSON.parse(testJson);
  var gbArray = JSON.parse(json_str);
  
  // 決定ボタンを二回目以降押したときのために配列をそれぞれリセット
  if(colorPosData.length > 0){colorPosData = [];}
  if(userClusterCenter.length > 0){userClusterCenter = [];}
  if(userHistory.length > 0){userHistory = [];}
  // データ点の配列を生成
  for(var i=0; i<gbArray.length; i++){
    var xMax = canvas.width - radius;
    var xMin = radius;
    var yMax = canvas.height - radius;
    var yMin = radius;
    var initX = Math.floor( Math.random() * (xMax + 1 - xMin) ) + xMin ;
    var initY = Math.floor( Math.random() * (yMax + 1 - yMin) ) + xMin ;
    
    //var initG = Math.random();
    //var initB = Math.random();
    colorPosData.push(new makeColorPosData(initX, initY, fixedR, gbArray[i][0], gbArray[i][1]));
    var index = colorPosData.length-1;
    colorPosData[index].clusterLabel = dataRecognize(index);
    //colorPosData.push(new makeColorPosData(canvas.width / 2 - objWidth / 2, canvas.height / 2 - objHeight / 2, fixedR, 180, 90));
  }
  // ユーザ操作によるクラスタ中心を生成
  for(var i=0; i<clusterNum; i++){
    userClusterCenter.push(new makeUserClusterCenter());  // 生成
    userCalcClusterCenter(i);
    // 初期クラスタを保存
    userHistory.push(new makeUserHistory(i, userClusterCenter[i].G, userClusterCenter[i].B));
    //console.log("yuz"+userHistory.length);
    console.log(i + ", " +userClusterCenter[i].normG +"," + userClusterCenter[i].normB);
  }
  repaint();
}
function onDown(e) {
  var offsetX = canvas.getBoundingClientRect().left;
  var offsetY = canvas.getBoundingClientRect().top;
  //console.log(offsetX+","+offsetY);
  //console.log(e.clientX+","+e.clientY);
  var x = e.clientX - offsetX;
  var y = e.clientY - offsetY;
  var selectedIndex;
  for(var i=0; i<colorPosData.length; i++){
    // 長方形の判定
    /*if (colorPosData[i].x < x && (colorPosData[i].x + objWidth) > x 
      && colorPosData[i].y < y && (colorPosData[i].y + objHeight) > y) {*/
    // 円の判定
    if(Math.sqrt(Math.pow(colorPosData[i].x-x,2)+Math.pow(colorPosData[i].y-y,2)) < radius){
      console.log(i);
      selectedIndex = i;
      dragging = true;
    }
  }
  if(dragging){
    relX = colorPosData[selectedIndex].x - x;
    relY = colorPosData[selectedIndex].y - y;
    colorPosData.push(colorPosData[selectedIndex]);
    colorPosData.splice(selectedIndex, 1);
  }
}
function onMove(e){
  var selectedIndex = colorPosData.length - 1;
  var offsetX = canvas.getBoundingClientRect().left;
  var offsetY = canvas.getBoundingClientRect().top;
  var x = e.clientX - offsetX;
  var y = e.clientY - offsetY;
  if (dragging) {
    colorPosData[selectedIndex].x = x + relX;
    colorPosData[selectedIndex].y = y + relY;
    repaint();
  }
}
function onUp(e){
  if(dragging){
    dragging = false;
    // クラスタ所属判定
    var changeCL = userDataAllocate();
    //console.log("変更："+changeCL);
    // クラスタ中心の再計算
    userCalcClusterCenter(changeCL);
    // クラスタ中心の変更履歴を保存
    userHistory.push(new makeUserHistory(changeCL, userClusterCenter[changeCL].G, userClusterCenter[changeCL].B));
  }
}
function dataRecognize(i){
  var userClusterLabel;
  if(colorPosData[i].x < canvas.width/2){
    if(colorPosData[i].y < canvas.height/2){
      // 左上
      console.log("左上");
      //alert("左上");
      userClusterLabel = 0;
    }else{
      // 左下
      console.log("左下");
      //alert("左下");
      userClusterLabel = 1;
    }
  }else{
    if(colorPosData[i].y < canvas.height/2){
      // 右上
      console.log("右上");
      //alert("右上");
      userClusterLabel = 2;
    }else{
      // 右下
      console.log("右下");
      //alert("右下");
      userClusterLabel = 3;
    }
  }
  return userClusterLabel;
}
function userDataAllocate(){
  console.log(selectedIndex);
  var selectedIndex = colorPosData.length - 1;
  colorPosData[selectedIndex].clusterLabel = dataRecognize(selectedIndex);
  return colorPosData[selectedIndex].clusterLabel;
}
function userCalcClusterCenter(changeCL){
  // クラスタ中心の計算
  // クラスタ中心の履歴を記録
  var sumG = 0;
  var sumB = 0;
  var count = 0;
  for(var i=0; i<colorPosData.length; i++){
    if(colorPosData[i].clusterLabel == changeCL){
      sumG += colorPosData[i].normG;
      sumB += colorPosData[i].normB;
      count++;
    }
  }
  userClusterCenter[changeCL].normG = sumG/count;
  userClusterCenter[changeCL].normB = sumB/count;
}

function drawLine(){
  context.strokeStyle = 'rgba(0, 0, 0,1)';
  // 横線
  context.beginPath();
  context.moveTo(0, canvas.height/2);
  context.lineTo(canvas.width, canvas.height/2);
  context.stroke();
  
  // 縦線
  context.beginPath();
  context.moveTo(canvas.width/2, 0);
  context.lineTo(canvas.width/2, canvas.height);
  context.stroke();
}
function drawCircle(i){
    // 円を塗りつぶす
    context.fillStyle = 'rgba('+colorPosData[i].r+','+colorPosData[i].g+','+colorPosData[i].b+',1)';
    context.beginPath();
    context.arc(colorPosData[i].x, colorPosData[i].y, radius, 0, Math.PI*2, false);
    context.fill();
    
    // 円の縁取り
    context.strokeStyle = 'rgba(0, 0, 0,1)';
    context.beginPath();
    context.arc(colorPosData[i].x, colorPosData[i].y, radius, 0, Math.PI*2, false);
    context.stroke();
}
  
function repaint(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawLine();
  for(var i=0; i<colorPosData.length; i++){
    drawCircle(i);
  }
}


// スクリプト読み込み時に実行される
var colorPosData = [];  // データ点オブジェクトを格納
var clusterNum = 4; // 左画面における識別のためのクラスタ数
var userClusterCenter = []; // ユーザ操作により計算されるクラスタ中心
var userHistory = [];
var canvas = document.getElementById("tutorial");
var context = canvas.getContext('2d');
var relX, relY;
var radius = 30;
var dragging = false;
var fixedR = 66;

canvas.addEventListener('mousedown', onDown, false);
canvas.addEventListener('mousemove', onMove, false);
canvas.addEventListener('mouseup', onUp, false);
init();
