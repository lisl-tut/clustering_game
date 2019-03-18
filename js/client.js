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

// GETメソッドの送信 -> request.responseTextを返す
function get(url){
  var request = new XMLHttpRequest();
  request.open('GET', url, false);
  request.send(null);
  return request.responseText;
};

// 問題データをとってくる関数
function getData(){
  virtualGetData('Data'+makeReqParams())
  return get('Data'+makeReqParams());
}

// 答え合わせボタンを押したときに呼ばれる関数
function getLearn(){
  return get('Learn');
}
