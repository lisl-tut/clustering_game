// スクリプト読み込み時に実行される
var canvas = $('#tutorial').get(0);
var context = canvas.getContext('2d');

var clusterNum = 4; // 左画面における識別のためのクラスタ数
var userClusterCenter = []; // ユーザ操作により計算されるクラスタ中心
var relX, relY;

var dataArray; // データ点オブジェクトを格納
var interfaceArray = [];
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

// canvas等の大きさを調整
function adjustComponents(){
  $('#tutorial').attr('width', $('#div1').width()/2.1);
  $('#tutorial').attr('height', $('#div1').height());
  $('#tutorial2').attr('width', $('#div1').width()/2.1);
  $('#tutorial2').attr('height', $('#div1').height());
}

// 決定ボタンを押したときに呼ばれる
function init() {

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
    interfaceArray[i].x = initX;
    interfaceArray[i].y = initY;
    var index = interfaceArray.length-1;
    interfaceArray[i].label = interfaceArray[i].allocateUserLabel();
  }
  initialInterface = $.extend(true, [], interfaceArray);
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
  var selectedIndex = findCircle(interfaceArray, x, y, radius);
  dragging = selectedIndex !== null;
  if(!dragging) return;
  relX = interfaceArray[selectedIndex].x - x;
  relY = interfaceArray[selectedIndex].y - y;
  //表示の関係で選択したものが一番最後に来るようにする。
  interfaceArray.push(interfaceArray[selectedIndex]);
  interfaceArray.splice(selectedIndex, 1);
}

function onMove(e){
  // 動かしている最中は動かしているものが配列の後ろに来るず
  var selectedIndex = interfaceArray.length - 1;
  var x = e.clientX - canvas.getBoundingClientRect().left;
  var y = e.clientY - canvas.getBoundingClientRect().top;
  if (!dragging) return;
  interfaceArray[selectedIndex].x = x + relX;
  interfaceArray[selectedIndex].y = y + relY;
  repaint();
}

function onUp(e){
  if(!dragging) return;
  //動かしたものは配列の後ろにある
  var selectedIndex = interfaceArray.length - 1;
  interfaceArray[selectedIndex].label = interfaceArray[selectedIndex].allocateUserLabel();
  clusterMeanHistory.push(ColorInterface.calcClusterMean(interfaceArray));
  interfaceHistory.push($.extend(true, {}, interfaceArray[selectedIndex]))
  dragging = false;
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

function drawCircle(obj){
  // 円を塗りつぶす
  if("getIntG" in obj){
    context.fillStyle = 'rgba('+obj.r+','+obj.getIntG()+','+obj.getIntB()+',1)';
  }else{
    context.fillStyle = 'rgba('+obj.r+','+obj.g+','+obj.b+',1)';
  }
  context.beginPath();
  context.arc(obj.x, obj.y, radius, 0, Math.PI*2, false);
  context.fill();
  // 円の縁取り
  context.strokeStyle = 'rgba(0, 0, 0,1)';
  context.beginPath();
  context.arc(obj.x, obj.y, radius, 0, Math.PI*2, false);
  context.stroke();
}
  
function repaint(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes();
  for(var i=0; i<interfaceArray.length; i++){
    drawCircle(interfaceArray[i]);
  }
}
