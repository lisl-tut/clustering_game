console.log('Hello world')

<!-- JSON受信 -->
<!-- 変数へ代入 -->
<!-- 左画面へ描画 -->

<!-- 丸を描画 -->
// オブジェクトの初期化
// オブジェクトを配列で保持
function makeColorPosData(x, y, r, g, b){
  this.x = x;
  this.y = y;
  this.r = r;
  this.g = g;
  this.b = b;
}

var colorPosData = [];

//console.log("要素数"+colorPosData.length)
//console.log(colorPosData[0].color)

  
var canvas = document.getElementById("tutorial");
var context = canvas.getContext('2d');
var x, y, relX, relY, objX, objY;
var objWidth, objHeight;
var dragging = false;
var selectedIndex;
var fixedR = 66;
function init() {
  objWidth = 50;
  objHeight = 50;

  // ユーザー用オブジェクト生成
  // 要素2個
  colorPosData.push(new makeColorPosData(1, 2, fixedR, 125, 3));
  colorPosData.push(new makeColorPosData(canvas.width / 2 - objWidth / 2, canvas.height / 2 - objHeight / 2, fixedR, 180, 90));
  repaint();
}
function onDown(e) {
  var offsetX = canvas.getBoundingClientRect().left;
  var offsetY = canvas.getBoundingClientRect().top;
  x = e.clientX - offsetX;
  y = e.clientY - offsetY;
  selectedIndex;
  for(var i=0; i<colorPosData.length; i++){
    if (colorPosData[i].x < x && (colorPosData[i].x + objWidth) > x 
      && colorPosData[i].y < y && (colorPosData[i].y + objHeight) > y) {
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
    context.fillRect(colorPosData[i].x, colorPosData[i].y, objWidth, objHeight);
  }
}
canvas.addEventListener('mousedown', onDown, false);
canvas.addEventListener('mousemove', onMove, false);
canvas.addEventListener('mouseup', onUp, false);

<!-- ユーザによる -->
