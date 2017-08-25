function playAnime(){
  console.log("playAnimation");
  // 左画面にオブジェクトが表示されているかチェック
  if(typeof leftFlag === "undefined" || leftFlag === false){
    console.log("左画面にオブジェクトがない");
    return;
  }
 // alert("アニメーション再生");
alert("playanima");
  
  // 右画面におけるユーザ操作のクラスタ中心とクラスタリング結果のデータ点、クラスタ中心の位置変換

// 答え合わせを押したときに呼ばれる
// 左画面が表示されているかのチェック
// = データ点の変数がある
  var rCanvas = document.getElementById("tutorial2");
  var rContext = rCanvas.getContext('2d');
  var resMap = JSON.parse(learn_json_str);
  console.log(learn_json_str);
  if(resMap["success"] !== true){console.log("受信失敗");return;}
  
  var dataPoint = [];
  //var centroid = [];
  function makeDataPos(x, y, g, b, id){
	this.x = x;
	this.y = y;
	this.g = g;
	this.b = b;
	this.id = id;
  }
  // 右画面におけるデータの位置座標とクラスタへの参照ラベルを取得
  for(var i=0; i<colorPosData.length; i++){
    dataPoint.push(new makeDataPos(userOprHistory[i].g/255, userOprHistory[i].b/255, userOprHistory[i].g, userOprHistory[i].b, userOprHistory[i].id));
	convRgbToPos(dataPoint[i], dataPoint[i].x, dataPoint[i].y);
  }
  // データ点をすべてRGBから画面上の位置へ変換
  function convRgbToPos(obj, colorG, colorB){
    obj.x = Math.round(colorG * (rCanvas.width - 2*radius)) + radius;
    obj.y = rCanvas.height - (Math.round(colorB*(rCanvas.height-2*radius))+radius);
	console.log(colorG + ", " + colorB);
	console.log(obj.x + ", " + obj.y);
    //obj.x = Math.round(resMap["result"][i]["centroid"][j]["x"] * (wih - 2*rightRadius)) + rightRadius;
    //obj.y = hgh - (Math.round(resMap["result"][i]["centroid"][j]["y"]*(hgh-2*rightRadius))+rightRadius);
  }
  
  // 描画
      /* 描画フロー */
  var t = 0;
  var count = 0;
  var rightRadius = 15;
 // var r = 10;  
  // データポイントのプロット関数
  function plotDataPoint(t){
    var resultIndex = t;
	if(resultIndex >= resMap["iters"]){resultIndex = resMap["iters"]-1;}
	
    for(var i=0; i<dataPoint.length; i++){
	  var clusterLabel = resMap["result"][resultIndex]["allocation"][dataPoint[i].id];
	//alert("i:"+i+","+dataPoint[i].id);// + ","+clusterLabel);
	//alert("cL"+clusterLabel + ", K:" + resMap["result"][resultIndex]["clusterNum"]);
	  var g = resMap["result"][resultIndex]["centroid"][clusterLabel]["x"] * 255;
	  var b = resMap["result"][resultIndex]["centroid"][clusterLabel]["y"] * 255;
//	  drawRightPCircle(dataPoint[i].x, dataPoint[i].y, dataPoint[i].g, dataPoint[i].b);
	  drawRightPCircle(dataPoint[i].x, dataPoint[i].y, g, b);
	  console.log(dataPoint[i].x);//+"," +dataPoint[i].y+","+ i)+
	  // 描画関数
	  // plot(dataPoint.x, dataPoint.y, cluster[dataPoint.id].g, cluster[dataPoint.id].b)
	}
  }
  function plotClusterCenter(t){
  	if(t == 0){return;}

    var resultIndex = t - 1;
	if(resultIndex+1 >= resMap["iters"]){resultIndex = resMap["iters"]-2;}
    
	var clusterNum = resMap["result"][resultIndex]["clusterNum"];
	var x = new Array(clusterNum);
	var y = new Array(clusterNum);
	//var g = resMap["result"][t]["centroid"];
	//var b = new Array(clusterNum);
	//alert(resMap["result"][0]["clusterNum"]+"aaaaaaaaaa"+clusterNum);
	//alert(resMap["iters"]);
	var centroid = [];
	for(var i=0; i<clusterNum; i++){
	  var g = resMap["result"][resultIndex]["centroid"][i]["x"];
	  var b = resMap["result"][resultIndex]["centroid"][i]["y"];
	  centroid.push(new makeDataPos(g, b, Math.round(g*255), Math.round(b*255), i));
	  //centroid.push(new makeDataPos(g, b, 255, 255, i));
	  convRgbToPos(centroid[i], g, b);
	  //alert(g + ", " + b);
	  //alert(centroid[i].g + ", " + centroid[i].b);
  	  drawRightCCircle(centroid[i].x, centroid[i].y, centroid[i].g, centroid[i].b);
	}
	//alert(centroid.length);
  }
  // データアイコン
  function drawRightPCircle(x, y, colorG, colorB, roundColorG, roundColorB){
    // 円を塗りつぶす
    rContext.fillStyle = 'rgba('+fixedR+','+colorG+','+colorB+',1)';
    rContext.beginPath();
    rContext.arc(x, y, rightRadius, 0, Math.PI*2, false);
    rContext.fill();
    
    // 円の縁取り
	//alert(rContext.lineWidth);
    rContext.strokeStyle = 'rgba(128,'+ roundColorG +','+ roundColorB+',1)';
    rContext.beginPath();
    rContext.arc(x, y, rightRadius, 0, Math.PI*2, false);
    rContext.stroke();
  }
  // クラスタアイコン
  function drawRightCCircle(x, y, colorG, colorB, roundColorG, roundColorB){
    // 円を塗りつぶす
    rContext.fillStyle = 'rgba('+fixedR+','+colorG+','+colorB+',1)';
    rContext.beginPath();
    rContext.arc(x, y, rightRadius, 0, Math.PI*2, false);
    rContext.fill();
    
    // 円の縁取り
	//alert(rContext.lineWidth);
	rContext.lineWidth = 5;
    rContext.strokeStyle = 'rgba(128,'+ roundColorG +','+ roundColorB+',1)';
    rContext.beginPath();
    rContext.arc(x, y, rightRadius-10, 0, Math.PI*2, false);
    rContext.stroke();

	rContext.lineWidth = 1;
    rContext.strokeStyle = 'rgba(128,'+ roundColorG +','+ roundColorB+',1)';
    rContext.beginPath();
    rContext.arc(x, y, rightRadius, 0, Math.PI*2, false);
    rContext.stroke();
  }
  
  // アニメーション描画のために呼ばれ続ける
  function render() {
    // Canvas全体をクリア
    rContext.clearRect(0, 0, rContext.width, rContext.height);

    // 要素を描画する
	
        
    // 左画面描画 ユーザオブジェクトのx,y,g,b
	
	// 右画面データ点描画
	plotDataPoint(t);
	// 右画面クラスタ中心描画
	plotClusterCenter(t);

	// 右画面ユーザ操作によるクラスタ中心
	
    // データ点は位置固定、
	count++;
	if(count % 3 == 0){
		t++;
		console.log("t:"+t);
	}

    // このrender関数を繰り返す
    // 下記どちらかを使った場合は、外側でrender()を実行する※1（もしくは即時実行）
    // setTimeout(render, 100);
    // requestAnimationFrame(render);
    }
    /* ※1 */
    // render();

    /* render()関数を繰り返す */
    /* setTimeout、requestAnimationFrameではなく、setIntervalを使う場合 */
    setInterval(render, 500);
  }

