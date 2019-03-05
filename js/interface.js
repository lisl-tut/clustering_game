// スクリプト読み込み時に実行される
var canvas = document.getElementById("tutorial");
var context = canvas.getContext('2d');

var initColorPosData = [];
var colorPosData = [];  // データ点オブジェクトを格納
var clusterNum = 4; // 左画面における識別のためのクラスタ数
var userClusterCenter = []; // ユーザ操作により計算されるクラスタ中心
var userHistory = []; // ユーザ操作によるクラスタ中心の移動履歴
var userOprHistory = []; // ユーザ操作によるオブジェクトの移動履歴
var relX, relY;
var radius = 30;
var dragging = false;
var fixedR = 66;
var leftFlag;

canvas.addEventListener('mousedown', onDown, false);
canvas.addEventListener('mousemove', onMove, false);
canvas.addEventListener('mouseup', onUp, false);

repaint();
$('#tutorial').css('visibility', 'hidden');
$('#tutorial2').css('visibility', 'hidden');

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

function makeUserClusterCenter(){
  this.g = null;
  this.b = null;
}

function makeUserHistory(id, g, b){
  this.id = id; // クラスタラベル
  this.g = g;
  this.b = b;
}

function makeUserOprHistory(id, x, y, g, b){
  this.id = id;
  this.x = x;
  this.y = y;
  this.g = g;
  this.b = b;
}

// 決定ボタンを押したときに呼ばれる
function init() {
  data_json_str = getData();
  $('#tutorial').attr('width', $('#div1').width()/2.1);
  $('#tutorial').attr('height', $('#div1').height());
  $('#tutorial2').attr('width', $('#div1').width()/2.1);
  $('#tutorial2').attr('height', $('#div1').height());
  $('#tutorial').css('visibility', 'visible');
  $('#tutorial2').css('visibility', 'visible');

  // サーバーから送られてきたデータをパースする
  var gbArray = JSON.parse(data_json_str);
  
  // 決定ボタンを二回目以降押したときのために配列をそれぞれリセット
  if(colorPosData.length > 0){colorPosData = [];}
  if(userClusterCenter.length > 0){userClusterCenter = [];}
  if(userHistory.length > 0){userHistory = [];}
  if(userOprHistory.length > 0){userOprHistory = [];}
  
  // データ点の配列を生成
  for(var i=0; i<gbArray.length; i++){
    var xMax = canvas.width - radius;
    var xMin = radius;
    var yMax = canvas.height - radius;
    var yMin = radius;
    var initX = Math.floor( Math.random() * (xMax + 1 - xMin) ) + xMin ;
    var initY = Math.floor( Math.random() * (yMax + 1 - yMin) ) + xMin ;
    
    colorPosData.push(new makeColorPosData(initX, initY, fixedR, gbArray[i]["point"][0], gbArray[i]["point"][1], i));
    var index = colorPosData.length-1;
    colorPosData[index].clusterLabel = dataRecognize(index);
    // ユーザ操作履歴初期化
    initColorPosData.push(new makeUserOprHistory(i, initX, initY, colorPosData[index].g, colorPosData[index].b));
  }
  // ユーザ操作によるクラスタ中心を生成
  for(var i=0; i<clusterNum; i++){
    userClusterCenter.push(new makeUserClusterCenter());  // 生成
    userCalcClusterCenter(i);
    // 初期クラスタを保存
    if(userClusterCenter[i].g === null && userClusterCenter[i].b === null){ 
      userHistory.push(new makeUserHistory(i, null, null));
    }else{
      userHistory.push(new makeUserHistory(i, Math.round(userClusterCenter[i].g*255), Math.round(userClusterCenter[i].b*255)));
    }
  }
  repaint();
  leftFlag = true;
}

function onDown(e) {
  var offsetX = canvas.getBoundingClientRect().left;
  var offsetY = canvas.getBoundingClientRect().top;
  var x = e.clientX - offsetX;
  var y = e.clientY - offsetY;
  var selectedIndex;
  for(var i=0; i<colorPosData.length; i++){
    // 円の判定
    if(Math.sqrt(Math.pow(colorPosData[i].x-x,2)+Math.pow(colorPosData[i].y-y,2)) < radius){
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
    var selectedIndex = colorPosData.length - 1;
	
    var oldCL = colorPosData[colorPosData.length-1].clusterLabel;
    dragging = false;
    // クラスタ所属判定
    var changeCL = userDataAllocate();
	
	var stateClusterNum = 4;
	// 現在のクラスタ中心をすべて保存
	for(var i=0; i<userClusterCenter.length; i++){
      userCalcClusterCenter(i);
      if(userClusterCenter[i].g === null && userClusterCenter[i].b === null){ 
	    userHistory.push(new makeUserHistory(i, null, null));
	  }else{
	    userHistory.push(new makeUserHistory(i, Math.round(userClusterCenter[i].g*255), Math.round(userClusterCenter[i].b*255)));
	  }
	}
    userOprHistory.push(new makeUserOprHistory(colorPosData[selectedIndex].id, colorPosData[selectedIndex].x, colorPosData[selectedIndex].y, colorPosData[selectedIndex].g, colorPosData[selectedIndex].b));
  }
  console.log("履歴の数"+userOprHistory.length);
}
function dataRecognize(i){
  var userClusterLabel;
  if(colorPosData[i].x < canvas.width/2){
    if(colorPosData[i].y < canvas.height/2){
      // 左上
      userClusterLabel = 0;
    }else{
      // 左下
      userClusterLabel = 1;
    }
  }else{
    if(colorPosData[i].y < canvas.height/2){
      // 右上
      userClusterLabel = 2;
    }else{
      // 右下
      userClusterLabel = 3;
    }
  }
  return userClusterLabel;
}
function userDataAllocate(){
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
    if(colorPosData[i].clusterLabel === changeCL){
      sumG += colorPosData[i].normG;
      sumB += colorPosData[i].normB;
      count++;
    }
  }
  if(count === 0){
    userClusterCenter[changeCL].g = null;
    userClusterCenter[changeCL].b = null;
  }else{
    console.log("count:"+count+", "+sumG+","+sumG/count);
    userClusterCenter[changeCL].g = sumG/count;
    userClusterCenter[changeCL].b = sumB/count;
  }
}

// 軸を描画する
function drawAxes(){
  context.strokeStyle = 'rgba(0, 0, 0,1)';
  // 横軸
  context.beginPath();
  context.moveTo(0, canvas.height/2);
  context.lineTo(canvas.width, canvas.height/2);
  context.stroke();
  // 縦軸
  context.beginPath();
  context.moveTo(canvas.width/2, 0);
  context.lineTo(canvas.width/2, canvas.height);
  context.stroke();
}

function drawCircle(plotObj){
  // 円を塗りつぶす
  context.fillStyle = 'rgba('+fixedR+','+plotObj.g+','+plotObj.b+',1)';
  context.beginPath();
  context.arc(plotObj.x, plotObj.y, radius, 0, Math.PI*2, false);
  context.fill();
  // 円の縁取り
  context.strokeStyle = 'rgba(0, 0, 0,1)';
  context.beginPath();
  context.arc(plotObj.x, plotObj.y, radius, 0, Math.PI*2, false);
  context.stroke();
}
  
function repaint(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes();
  for(var i=0; i<colorPosData.length; i++){
    drawCircle(colorPosData[i]);
  }
}
