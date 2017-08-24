function sendRequest(){
    var url='HelloWorld';
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);
    document.getElementById("hoge").textContent = request.responseText;
}

var data_json_str;
var learn_json_str;

function getData(){
    var form = document.settei
    
    var url='Data';
    var params = "?";
   
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

    document.getElementById("request").textContent = url+params;
    var request = new XMLHttpRequest();
    request.open('GET', url+params, false);
    request.send(null);
    data_json_str = request.responseText;
    document.getElementById("test").textContent = data_json_str;
    init();
}

function getLearn(){
    var url='Learn';
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);
    learn_json_str = request.responseText;
    document.getElementById("test").textContent = learn_json_str;
    playAnime();
}

function rewrite(){
    document.getElementById("hoge").textContent = "watanabe";
}
