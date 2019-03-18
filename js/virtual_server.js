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
  return null;
}

function randCluster(){
  
}