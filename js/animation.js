// 答え合わせを押したときに呼ばれる
// 左画面が表示されているかのチェック
// = データ点の変数がある

/* ======== ここからmain ======== */
var rCanvas = document.getElementById("tutorial2");
var rContext = rCanvas.getContext('2d');
drawAxis(); //軸を表示
loop(0, hoge); //ループ処理(0から開始してhogeまで)
/* ======== mainここまで ======== */


/* ここにloop関数でループさせる内容を書いてください． */
function loopContent(i){
    plotClusterCenterHistory(userHistory, i, 0); //userのクラスタ中心の履歴の描画



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
軸を表示する関数
軸には目盛りは振っていませんが，0から255とだけ描画されるようにしてあります．
*/
function drawAxis(){
    rContext.beginPath();
    rContext.strokeStyle = 'rgb(0, 0, 0)';
    rContext.moveTo(rCanvas.width*0.1, rCanvas.height*0.9);
    rContext.lineTo(rCanvas.width*0.1, rCanvas.height*0.1);
    rContext.stroke();
    rContext.moveTo(rCanvas.width*0.1, rCanvas.height*0.9);
    rContext.lineTo(rCanvas.width*0.9, rCanvas.height*0.9);
    rContext.stroke();

    rContext.fillText('0', rCanvas.width*0.1-10, rCanvas.height*0.9);
    rContext.fillText('255', rCanvas.width*0.1-20, rCanvas.height*0.11);
    rContext.fillText('0', rCanvas.width*0.1, rCanvas.height*0.9+10);
    rContext.fillText('255', rCanvas.width*0.9-10, rCanvas.height*0.9+10);
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
    if(num > (dotHistory.length - 4)/2) num = (dotHistory.length - 4)/2; //表示回数がデータの表示できる回数分より大きかった場合はそこで打ち切る

    /*データの表示*/
    //初めの4つ
    plotDot(dotHistory[0]['x'], dotHistory[0]['y'], marker, dotHistory[0]['id']);
    plotDot(dotHistory[1]['x'], dotHistory[1]['y'], marker, dotHistory[1]['id']);
    plotDot(dotHistory[2]['x'], dotHistory[2]['y'], marker, dotHistory[2]['id']);
    plotDot(dotHistory[3]['x'], dotHistory[3]['y'], marker, dotHistory[3]['id']);
    //更新データ
    for(n = 0; n < num; n++){
        i = 4 + n*2;
        plotDot(dotHistory[i]['x'], dotHistory[i]['y'], marker, dotHistory[i]['id']);
        plotDot(dotHistory[i+1]['x'], dotHistory[i+1]['y'], marker, dotHistory[i+1]['id']);
    }
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
        //console.log('counter:' + i)
        loopContent(i);
        setTimeout(function(){loop(++i, endCount)}, 1000);
    }
}
