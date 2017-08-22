<!-- JSON受信 -->
<!-- 変数へ代入 -->
<!-- 左画面へ描画 -->

<!-- 丸を描画 -->
// オブジェクトの初期化
// オブジェクトを配列で保持
function makeColorPosData(x, y, r, normG, normB){
  this.x = x; // 左画面においてのx座標
  this.y = y; // 左画面においてのy座標
  this.normG = normG; // 元データ（正規化されている）
  this.normB = normB; // 元データ（正規かされている）
  this.r = r; // 赤：とりあえず固定
  this.g = Math.round(this.normG*255); // 色データへ変換
  this.b = Math.round(this.normB*255); // 色データへ変換
  this.clusterLabel = -1; // ユーザが設定する所属クラスタへのラベル
}

function makeUserClusterCenter(){
  this.g = NaN;
  this.b = NaN;
}
var colorPosData = [];

var clusterNum = 4;
var userClusterCenter = [];
for(var i=0; i<clusterNum; i++){
  userClusterCenter.push(new makeUserClusterCenter());
}
//console.log("要素数"+colorPosData.length)
//console.log(colorPosData[0].color)

// データ数暫定
var dataNum = 10;
  
var canvas = document.getElementById("tutorial");
var context = canvas.getContext('2d');
var x, y, relX, relY, objX, objY;
var objWidth, objHeight, radius;
var dragging = false;
var selectedIndex;
var fixedR = 66;
function init() {
  objWidth = 50;
  objHeight = 50;
  radius = 30;
  // ユーザー用オブジェクト生成

  for(var i=0; i<dataNum; i++){
    var xMax = canvas.width - radius;
    var xMin = radius;
    var yMax = canvas.height - radius;
    var yMin = radius;
    var initX = Math.floor( Math.random() * (xMax + 1 - xMin) ) + xMin ;
    var initY = Math.floor( Math.random() * (yMax + 1 - yMin) ) + xMin ;
    
    // 暫定 受信したデータで構成
    var initG = Math.random();
    var initB = Math.random();
    colorPosData.push(new makeColorPosData(initX, initY, fixedR, initG, initB));

    //colorPosData.push(new makeColorPosData(canvas.width / 2 - objWidth / 2, canvas.height / 2 - objHeight / 2, fixedR, 180, 90));
  }
  repaint();
}
function onDown(e) {
  var offsetX = canvas.getBoundingClientRect().left;
  var offsetY = canvas.getBoundingClientRect().top;
  //console.log(offsetX+","+offsetY);
  //console.log(e.clientX+","+e.clientY);
  x = e.clientX - offsetX;
  y = e.clientY - offsetY;
  selectedIndex;
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
  }
}
function onMove(e){
  var offsetX = canvas.getBoundingClientRect().left;
  var offsetY = canvas.getBoundingClientRect().top;
  x = e.clientX - offsetX;
  y = e.clientY - offsetY;
  if (dragging) {
    colorPosData[selectedIndex].x = x + relX;
    colorPosData[selectedIndex].y = y + relY;
    repaint();
  }
}
function onUp(e){
  dragging = false;
  // クラスタ所属判定
  userDataAllocate();
  // クラスタ中心の記録
  userCalcClusterCenter();
}
function userDataAllocate(){
  // ユーザはいくつに分けるか知っている？
  
  //console.log(selectedIndex);
  if(colorPosData[selectedIndex].x < canvas.width/2){
    if(colorPosData[selectedIndex].y < canvas.height/2){
      // 左上
      console.log("左上");
      colorPosData[selectedIndex].clusterLabel = 0;
    }else{
      // 左下
      console.log("左下");
      colorPosData[selectedIndex].clusterLabel = 1;
    }
  }else{
    if(colorPosData[selectedIndex].y < canvas.height/2){
      // 右上
      console.log("右上");
      colorPosData[selectedIndex].clusterLabel = 2;
    }else{
      // 右下
      console.log("右下");
      colorPosData[selectedIndex].clusterLabel = 3;
    }
  }
}
function userCalcClusterCenter(){
  // クラスタ中心の計算
  // クラスタ中心の履歴を記録
}

function drawLine(){
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
  
function repaint(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawLine();
  for(var i=0; i<colorPosData.length; i++){
    context.fillStyle = 'rgb('+colorPosData[i].r+','+colorPosData[i].g+','+colorPosData[i].b+')';
    //console.log(colorPosData[i].r+", \t\t\t\t"+colorPosData[i].g+",       \t\t\t\t\t" + colorPosData[i].b);
    //context.fillRect(colorPosData[i].x, colorPosData[i].y, objWidth, objHeight);
    context.beginPath();
    context.arc(colorPosData[i].x, colorPosData[i].y, radius, 0, Math.PI*2, false);
    context.fill();
  }
}
canvas.addEventListener('mousedown', onDown, false);
canvas.addEventListener('mousemove', onMove, false);
canvas.addEventListener('mouseup', onUp, false);
init();

// クラスタ中心の計算
// クラスタの所属判定
