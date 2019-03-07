// スクリプト読み込み時に実行される
var canvas = $('#tutorial').get(0);
var context = canvas.getContext('2d');

var colorPosData = []; // データ点オブジェクトを格納
var clusterNum = 4; // 左画面における識別のためのクラスタ数
var userClusterCenter = []; // ユーザ操作により計算されるクラスタ中心
var userHistory = []; // ユーザ操作によるクラスタ中心の移動履歴
var relX, relY;

var dataArray; // データ点オブジェクトを格納
var interfaceArray;
var initialInterface;
var interfaceHistory;
var clusterMeanHistory;

var radius = 30; //円の大きさ
var fixedR = 66; //Rの値

var dragging = false; //ドラッグ中かを示す変数
var leftFlag;

function turnCanvas(turnOn){
  if(turnOn){
    $('#tutorial').css('visibility', 'visible');
    $('#tutorial2').css('visibility', 'visible');
  }else{
    $('#tutorial').css('visibility', 'hidden');
    $('#tutorial2').css('visibility', 'hidden');
  }
}

canvas.addEventListener('mousedown', onDown, false);
canvas.addEventListener('mousemove', onMove, false);
canvas.addEventListener('mouseup', onUp, false);

repaint();
turnCanvas(false);

class Data{
  constructor(id, g, b, label){
    this.id = id;
    this.label = label;
    this.g = g;  // 0.0 ~ 1.0の範囲で与えられる
    this.b = b;  //
  }
}

// 左画面の分類操作用インターフェイス
class ColorInterface{
  //Dataインスタンス
  constructor(data){
    this.x = this.allocateInitialX();
    this.y = this.allocateInitialY();
    // int型 0~255
    this.id = data.id;
    this.label = this.allocateUserLabel();
    this.r = fixedR;
    this.g = data.g;
    this.b = data.b;
  }
  getIntG(){
    return Math.round(this.g*ColorInterface.COLOR_MAX);
  }
  getIntB(){
    return Math.round(this.b*ColorInterface.COLOR_MAX);
  }
  // 左画面の円の表示場所をランダムにするための初期座標を決める
  allocateInitialX(){
    const xMax = canvas.width - radius;
    const xMin = radius;
    return Math.floor( Math.random() * (xMax + 1 - xMin) ) + xMin;
  }
  allocateInitialY(){
    const yMax = canvas.height - radius;
    const yMin = radius;
    return Math.floor( Math.random() * (yMax + 1 - yMin) ) + yMin ;
  }
  // インターフェイス上の座標から適切なラベルを取得する
  allocateUserLabel(){
    if(this.x < canvas.width/2){
      if(this.y < canvas.height/2){
        return 0; // 左上
      }else{
        return 1; // 左下
      }
    }else{
      if(this.y < canvas.height/2){
        return 2; // 右上
      }else{
        return 3; // 右下
      }
    }
  }
}
ColorInterface.COLOR_MAX = 255; //色データの範囲
// クラスタ中心の計算
ColorInterface.calcClusterMean = function(arr){
  var result = {};
  var cnt = {};
  for (let i = 0; i < arr.length; i++) {   
    const ele = arr[i];
    if (ele.label in result) {
      result[ele.label]["g"] += ele.getIntG();
      result[ele.label]["b"] += ele.getIntB();
      cnt[ele.label]++;
    }else{
      result[ele.label] = {};
      result[ele.label]["g"] = ele.getIntG();
      result[ele.label]["b"] = ele.getIntB();
      cnt[ele.label] = 1;
    }
  }
  for (const key in cnt) {
    result[key]["g"] = Math.round(result[key]["g"] / cnt[key]);
    result[key]["b"] = Math.round(result[key]["b"] / cnt[key]);
  }
  return result;
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
    //console.log("count:"+count+", "+sumG+","+sumG/count);
    userClusterCenter[changeCL].g = sumG/count;
    userClusterCenter[changeCL].b = sumB/count;
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

function makeUserClusterCenter(){
  this.g = null;
  this.b = null;
}

function makeUserHistory(id, g, b){
  this.id = id; // クラスタラベル
  this.g = g;
  this.b = b;
}

// 変数のリセット
function resetVariables(){
  if(colorPosData.length > 0){colorPosData = [];}
  if(userClusterCenter.length > 0){userClusterCenter = [];}
  if(userHistory.length > 0){userHistory = [];}
}

// canvas等の大きさを調整
function adjustComponents(){
  $('#tutorial').attr('width', $('#div1').width()/2.1);
  $('#tutorial').attr('height', $('#div1').height());
  $('#tutorial2').attr('width', $('#div1').width()/2.1);
  $('#tutorial2').attr('height', $('#div1').height());
}

// 決定ボタンを押したときに呼ばれる
function init() {

  resetVariables();  //決定ボタンを二回押したときの対策処理
  adjustComponents();  //コンポーネントの大きさを設定する
  turnCanvas(true);  //canvasを可視状態にする

  // サーバーから送られてきたデータをパースする
  var gbArray = JSON.parse(getData());
  dataArray = [];
  for (let i = 0; i < gbArray.length; i++) {
    const gb = gbArray[i];
    dataArray.push(new Data(i, gb["point"][0], gb["point"][1], gb["cluster"]));
  }
  // インターフェイス用のインスタンス作成
  interfaceArray = [];
  for (let i = 0; i < gbArray.length; i++) {
    interfaceArray.push(new ColorInterface(dataArray[i]));
  }
  interfaceHistory = [];
  clusterMeanHistory = [];
  clusterMeanHistory.push(ColorInterface.calcClusterMean(interfaceArray));

  // データ点の配列を生成
  var xMax = canvas.width - radius;
  var xMin = radius;
  var yMax = canvas.height - radius;
  var yMin = radius;
  for(var i=0; i<gbArray.length; i++){
    var initX = Math.floor( Math.random() * (xMax + 1 - xMin) ) + xMin ;
    var initY = Math.floor( Math.random() * (yMax + 1 - yMin) ) + xMin ;
    colorPosData.push(new makeColorPosData(initX, initY, fixedR, gbArray[i]["point"][0], gbArray[i]["point"][1], i));
    interfaceArray[i].x = initX;
    interfaceArray[i].y = initY;
    var index = colorPosData.length-1;
    colorPosData[index].clusterLabel = dataRecognize(index);
    interfaceArray[i].label = dataRecognize(index);
  }
  initialInterface = $.extend(true, [], interfaceArray);
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

function findCircle(arr, x, y, r){
  var res = null;
  for (let i = 0; i < arr.length; i++) {
    const ele = arr[i];
    if(Math.sqrt(Math.pow(ele.x - x, 2) + Math.pow(ele.y - y, 2)) < r){
      res = i;
    }
  }
  return res;
}

function onDown(e) {
  // クリックされた位置の相対座標を取得
  var x = e.clientX - canvas.getBoundingClientRect().left;
  var y = e.clientY - canvas.getBoundingClientRect().top;
  // 選択されたオブジェクトの要素番号を取得
  var selectedIndex = findCircle(colorPosData, x, y, radius);
  var aaa = findCircle(interfaceArray, x, y, radius);
  dragging = selectedIndex !== null;
  if(!dragging) return;
  relX = colorPosData[selectedIndex].x - x;
  relY = colorPosData[selectedIndex].y - y;
  //表示の関係で選択したものが一番最後に来るようにする。
  colorPosData.push(colorPosData[selectedIndex]);
  colorPosData.splice(selectedIndex, 1);
  interfaceArray.push(interfaceArray[aaa]);
  interfaceArray.splice(aaa, 1);
}

function onMove(e){
  // 動かしている最中は動かしているものが配列の後ろに来るず
  var selectedIndex = colorPosData.length - 1;
  var x = e.clientX - canvas.getBoundingClientRect().left;
  var y = e.clientY - canvas.getBoundingClientRect().top;
  if (!dragging) return;
  colorPosData[selectedIndex].x = x + relX;
  colorPosData[selectedIndex].y = y + relY;
  interfaceArray[selectedIndex].x = x + relX;
  interfaceArray[selectedIndex].y = y + relY;
  repaint();
}

function onUp(e){
  if(!dragging) return;
  //動かしたものは配列の後ろにある
  var selectedIndex = colorPosData.length - 1;	
  colorPosData[selectedIndex].clusterLabel = dataRecognize(selectedIndex);
  interfaceArray[selectedIndex].label = interfaceArray[selectedIndex].allocateUserLabel();
  // 現在のクラスタ中心をすべて保存
  for(var i=0; i<userClusterCenter.length; i++){
      userCalcClusterCenter(i);
      if(userClusterCenter[i].g === null && userClusterCenter[i].b === null){ 
      userHistory.push(new makeUserHistory(i, null, null));
    }else{
      userHistory.push(new makeUserHistory(i, Math.round(userClusterCenter[i].g*255), Math.round(userClusterCenter[i].b*255)));
    }
  }
  clusterMeanHistory.push(ColorInterface.calcClusterMean(interfaceArray));
  interfaceHistory.push($.extend(true, {}, interfaceArray[selectedIndex]))
  dragging = false;
  console.log(clusterMeanHistory)
  console.log(userHistory)
}

/* 消す予定 */
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
