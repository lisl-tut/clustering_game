// 共有変数
var data_json_str; // 色データを保存しておくための変数
var learn_json_str; // 学習結果データを保存しておくための変数

// フォームからゲームルールを取得してURLのパラメータの文字列を返す
function makeReqParams(){
  var form = document.settei;  //フォーム
  var params = "?"; //パラメータ

  //kind of Algorithm
  var index = form.algorithm.selectedIndex;
  var alg_value = form.algorithm.options[index].value;
  params += "alg=" + alg_value;
  //num of Cluster
  index = form.clusterNum.selectedIndex;
  var clu_value = form.clusterNum.options[index].value;
  params += "&clu=" + clu_value;
  //penalty parameter
  index = form.threshold.selectedIndex;
  var thr_value = form.threshold.options[index].value;
  params += "&thr=" + thr_value;
  //num making cluster
  index = form.makeClusterNum.selectedIndex;
  var mak_value = form.makeClusterNum.options[index].value;
  params += "&mak=" + mak_value;
  //tuning
  index = form.tuning.selectedIndex;
  var tun_value = form.tuning.options[index].value;
  params += "&tun=" + tun_value;

  return params;
}

// 決定ボタンを押したときに呼ばれる関数
function getData(){
  var request = new XMLHttpRequest();
  request.open('GET', 'Data'+makeReqParams(), false);
  request.send(null);
  return request.responseText;
}

function getLearn(){
    var request = new XMLHttpRequest();
    request.open('GET', 'Learn', false);
    request.send(null);
    learn_json_str = request.responseText;
    playAnime();
}
