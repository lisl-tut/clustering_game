// スクリプト読み込み時に実行される
var canvas = $('#tutorial').get(0);
var context = canvas.getContext('2d');

var clusterNum = 4; // 左画面における識別のためのクラスタ数
var relX, relY;

var dataArray; // データ点オブジェクトを格納
var interfaceArray = [];  // 左画面のインターフェースを構成する丸を格納
var initialInterface;  // インターフェースの初期状態を格納
var interfaceHistory;  // インターフェースの履歴を格納 
var clusterMeanHistory;  // インターフェースのクラスタ中心を格納

var radius = 30; //円の大きさ
var fixedR = 66; //Rの値

var dragging = false; //ドラッグ中かを示す変数
var leftFlag;

canvas.addEventListener('mousedown', onDown, false);
canvas.addEventListener('mousemove', onMove, false);
canvas.addEventListener('mouseup', onUp, false);

repaint();
turnCanvas(false);


function turnCanvas(turnOn){
  if(turnOn){
    $('#tutorial').css('visibility', 'visible');
    $('#tutorial2').css('visibility', 'visible');
  }else{
    $('#tutorial').css('visibility', 'hidden');
    $('#tutorial2').css('visibility', 'hidden');
  }
}

// canvas等の大きさを調整
function adjustComponents(){
  $('#tutorial').attr('width', $('#div1').width()/2.1);
  $('#tutorial').attr('height', $('#div1').height());
  $('#tutorial2').attr('width', $('#div1').width()/2.1);
  $('#tutorial2').attr('height', $('#div1').height());
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

  initialInterface = $.extend(true, [], interfaceArray);
  repaint();
  leftFlag = true;
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
