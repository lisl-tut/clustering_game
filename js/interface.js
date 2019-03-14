// スクリプト読み込み時に実行される
var lCanvas = $('#tutorial').get(0);
var lContext = lCanvas.getContext('2d');
var rCanvas = $('#tutorial2').get(0);
var rContext = rCanvas.getContext('2d');

var clusterNum = 4; // 左画面における識別のためのクラスタ数
var relX, relY; // 丸の中心に対してどの位置をクリックしているかを保存する

var interfaceArray;  // 左画面のインターフェースを構成する丸を格納
var initialInterface;  // インターフェースの初期状態を格納
var interfaceHistory;  // インターフェースの履歴を格納 
var clusterMeanHistory;  // インターフェースのクラスタ中心を格納

var resMap; // 学習結果を格納
var dataPoint; // 右画面の描画用のデータの格納

var dragging = false; //ドラッグ中かを示す変数
var leftFlag = false; // 決定ボタンが押されているかのフラグ

// 初期設定
lCanvas.addEventListener('mousedown', onDown, false);
lCanvas.addEventListener('mousemove', onMove, false);
lCanvas.addEventListener('mouseup', onUp, false);
turnCanvas(false);

/* ----- 以下関数 ----- */

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

// 決定ボタンを押したときに呼ばれる
function init() {

  adjustComponents();  //コンポーネントの大きさを設定する
  turnCanvas(true);  //canvasを可視状態にする

  // サーバーから送られてきたデータをパースする
  var gbArray = JSON.parse(getData());
  interfaceArray = [];
  for (let i = 0; i < gbArray.length; i++) {
    const gb = gbArray[i];
    interfaceArray.push(ColorInterface.create(i, fixedR, gb.point[0], gb.point[1]));
  }
  interfaceHistory = [];
  clusterMeanHistory = [];
  clusterMeanHistory.push(ColorInterface.calcClusterMean(interfaceArray));
  initialInterface = ColorInterface.copyArray(interfaceArray);
  drawLeftPanel();
  leftFlag = true;
}

function onDown(e) {
  // クリックされた位置の相対座標を取得
  var x = e.clientX - lCanvas.getBoundingClientRect().left;
  var y = e.clientY - lCanvas.getBoundingClientRect().top;
  // 選択されたオブジェクトの要素番号を取得
  var selectedIndex = ColorInterface.findCircle(interfaceArray, x, y, radius);
  dragging = selectedIndex !== null;
  if(!dragging) return;
  relX = interfaceArray[selectedIndex].x - x;
  relY = interfaceArray[selectedIndex].y - y;
  //表示の関係で選択したものが一番最後に来るようにする。
  interfaceArray.push(ColorInterface.copyArray(interfaceArray)[selectedIndex]);
  interfaceArray.splice(selectedIndex, 1);
}

function onMove(e){
  // 動かしている最中は動かしているものが配列の後ろに来るず
  var selectedIndex = interfaceArray.length - 1;
  var x = e.clientX - lCanvas.getBoundingClientRect().left;
  var y = e.clientY - lCanvas.getBoundingClientRect().top;
  if (!dragging) return;
  interfaceArray[selectedIndex].x = x + relX;
  interfaceArray[selectedIndex].y = y + relY;
  drawLeftPanel();
}

function onUp(e){
  if(!dragging) return;
  //動かしたものは配列の後ろにある
  var selectedIndex = interfaceArray.length - 1;
  interfaceArray[selectedIndex].label = interfaceArray[selectedIndex].allocateUserLabel();
  clusterMeanHistory.push(ColorInterface.calcClusterMean(interfaceArray));
  interfaceHistory.push(ColorInterface.copyArray(interfaceArray)[selectedIndex])
  dragging = false;
}

// 左画面の軸を描画する
function drawLeftAxis(){
  lContext.strokeStyle = 'rgba(0, 0, 0,1)';
  // 横軸
  lContext.beginPath();
  lContext.moveTo(0, lCanvas.height/2);
  lContext.lineTo(lCanvas.width, lCanvas.height/2);
  lContext.stroke();
  // 縦軸
  lContext.beginPath();
  lContext.moveTo(lCanvas.width/2, 0);
  lContext.lineTo(lCanvas.width/2, lCanvas.height);
  lContext.stroke();
}

/*
右画面の軸を表示する関数
軸には目盛りは振っていませんが，0から255とだけ描画されるようにしてあります．
*/
function drawRightAxis(){
  rContext.lineWidth = 1;
  rContext.beginPath();
  rContext.strokeStyle = 'rgb(0, 0, 0)';
  rContext.moveTo(rCanvas.width*0.1, rCanvas.height*0.9);
  rContext.lineTo(rCanvas.width*0.1, rCanvas.height*0.1);
  rContext.stroke();
  rContext.moveTo(rCanvas.width*0.1, rCanvas.height*0.9);
  rContext.lineTo(rCanvas.width*0.9, rCanvas.height*0.9);
  rContext.stroke();
  rContext.fillStyle = 'rgb(0, 0, 0)';
  rContext.fillText('0', rCanvas.width*0.1-10, rCanvas.height*0.9);
  rContext.fillText('255', rCanvas.width*0.1-20, rCanvas.height*0.11);
  rContext.fillText('0', rCanvas.width*0.1, rCanvas.height*0.9+10);
  rContext.fillText('255', rCanvas.width*0.9-10, rCanvas.height*0.9+10);
}

// 円を描画
function drawCircle(context, x, y, r, g, b, radius){
  // 円を塗りつぶす
  context.fillStyle = 'rgba('+r+','+g+','+b+',1)';
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI*2, false);
  context.fill();
  // 円の縁取り
  context.lineWidth = 1;
  context.strokeStyle = 'rgba(0, 0, 0,1)';
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI*2, false);
  context.stroke();
}

// canvasを白紙にする
function clearPanel(canvas){
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawLeftPanel(){
  if(typeof interfaceArray === "undefined"){
    return;
  }
  clearPanel(lCanvas);
  drawLeftAxis();
  for(var i=0; i<interfaceArray.length; i++){
    const obj = interfaceArray[i]
    drawCircle(lContext, obj.x, obj.y, fixedR, obj.getIntG(), obj.getIntB(), radius);
  }
}
