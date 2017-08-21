function sendRequest(){
    var url='HelloWorld';
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);
    document.getElementById("hoge").textContent = request.responseText;
}


function rewrite(){
    document.getElementById("hoge").textContent = "watanabe";
}
