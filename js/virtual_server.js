/*
 * Java Servlet の機能を一旦模倣する形で実装
 */

var virtualResultJson;
var virtualRequestJson;
var cluNum;  // 正解のクラスタ数

// URLパラメータを取得してオブジェクトで返す
// need to include jQuery
function getURLParameters(path){
  var elm = $('<a>', { href:path } )[0].search.slice(1);
  var split = elm.split("&");
  var parameters = {}
  for (let i = 0; i < split.length; i++) {
    const ele = split[i];
    parameters[ele.split("=")[0]] = ele.split("=")[1];
  }
  return parameters;
}

// Box-Muller法で正規乱数を生成
function rnorm(){
  return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
}

// client.js にある getData関数と同等の機能をここで提供することを最終目標にする
/*
 * [{"cluster": 1, "point": [0.2424, 0.3535]}, {"cluster": 2, "point": [0.1313, 0.7979]}]
 */
function virtualGetData(path){
  virtualRequestJson = getURLParameters(path);
  var dg = new DataGenerator(virtualRequestJson["mak"], virtualRequestJson["tun"]);
  var samples = dg.generate();
  cluNum = dg.clusterNum;  // learn関数に渡す
  learn(); // 仮想的にここにおいておくが、実際に使うときはinit関数に組み込む
  return samples;
}

class DataGenerator{
  constructor(clusterNum, tuning=2){
    this.samples = [];
    this.sd = 0.1;  // データを生成する分布の標準偏差
    this.criticalRegion = 2.0;
    this.N = 20;  // データの生成数
    this.tuning = 2;  // チューニングパラメータのデフォルト
    this.clusterNum = clusterNum == 0 ? Math.floor(Math.random()*3+2) : clusterNum;  // クラスタの数
    this.tuning = tuning;  // 問題の難易度を決める整数
  }

  /* 問題の難易度（クラスタ間距離に関係）に応じてクラスタ中心を決定する */
  setClusterCenters(){
    this.clusterCenters = [];
    for (let i = 0; i < this.clusterNum; i++) {
      var x = (1-2*this.criticalRegion*this.sd)*Math.random() + this.sd*this.criticalRegion;
      var y = (1-2*this.criticalRegion*this.sd)*Math.random() + this.sd*this.criticalRegion;
      this.clusterCenters.push({x: x, y: y, label:i});
    }
    var clusterCentersMean = {x: 0.0, y: 0.0};
    for (let i = 0; i < this.clusterNum; i++) {
      clusterCentersMean.x += this.clusterCenters[i].x / this.clusterNum;
      clusterCentersMean.y += this.clusterCenters[i].y / this.clusterNum;
    }
    var clusterCenterVar = 0;
    for (let i = 0; i < this.clusterNum; i++) {
      clusterCenterVar += Math.pow(this.clusterCenters[i].x - clusterCentersMean.x, 2) 
          + Math.pow(this.clusterCenters[i].y - clusterCentersMean.y, 2);
    }
    clusterCenterVar /= this.clusterNum;
    switch (this.tuning) {
      case 0:
        // 分散が小さかったらクラスタ中心の決め直し
        if(clusterCenterVar <= 1.0/8.0){
          this.setClusterCenters();
        }
        break;
      case 1:
        // 分散が大きかったらクラスタ中心の決め直し
        if(clusterCenterVar > 1.0/8.0){
          this.setClusterCenters();
        }
        break;
      case 2:
        break;
      default:
        break;
    }
    return;
  }

  generate(){
    this.setClusterCenters();
    var samples = [];
    for (let i = 0; i < this.N; i++) {
      var label = Math.floor(Math.random() * this.clusterNum);
      var x = this.clusterCenters[label].x + rnorm() * this.sd;
      var y = this.clusterCenters[label].y + rnorm() * this.sd;
      samples.push({
        cluster: label,
        point: [x, y]
      });
    }
    return samples;
  }
}

function learn(){
  // k-means法のパラメータ
  var k = parseInt(virtualRequestJson["clu"]);
  if ( parseInt(virtualRequestJson["mak"]) === 0 ) {
    k = cluNum;
  }
  // DP-means法のパラメータ
  var lambda = parseInt(virtualRequestJson["thr"]);
  var alg = parseInt(virtualRequestJson["alg"]);
  var clustering = new Clustering(alg);
}

class Clustering{
  constructor(alg){

  }
}