/*
 * Java Servlet の機能を一旦模倣する形で実装
 */

var virtualResultJson;
var virtualRequestJson;

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

// client.js にある getData関数と同等の機能をここで提供することを最終目標にする
/*
 * [{"cluster": 1, "point": [0.2424, 0.3535]}, {"cluster": 2, "point": [0.1313, 0.7979]}]
 */
function virtualGetData(path){
  virtualRequestJson = getURLParameters(path);
  var dg = new DataGenerator(virtualRequestJson["mak"], virtualRequestJson["tun"]);
  var samples = dg.generate();
  console.log("samples are " + samples);
  return null;
}

class DataGenerator{
  constructor(clusterNum, tuning){
    this.samples = [];
    this.sd = 0.1;  // データを生成する分布の標準偏差
    this.criticalRegion = 2.0;
    this.N = 20;  // データの生成数
    this.tuning = 2;  // チューニングパラメータのデフォルト
  }

  generate(){
    return [0, 0, 0];
  }
}