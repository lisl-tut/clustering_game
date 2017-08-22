function sendRequest(){
    var url='HelloWorld';
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);
    document.getElementById("hoge").textContent = request.responseText;
}

function getData(){
    var index = document.selbox.numofdata.selectedIndex;
    var numofdata = document.selbox.numofdata.options[index].text;
    var url='Data';
    var param = "?numofdata=" + numofdata
    var request = new XMLHttpRequest();
    request.open('GET', url+param, false);
    request.send(null);
    document.getElementById("hoge").textContent = request.responseText;
}

function getLearn(){
    var url='Learn';
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);
    document.getElementById("hoge").textContent = request.responseText;
}

function rewrite(){
    document.getElementById("hoge").textContent = "watanabe";
}
