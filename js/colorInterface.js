var rightRadius = 15; //右グラフの円の大きさ
var radius = 30; //円の大きさ
var fixedR = 66; //Redの値

// 左画面の分類操作用インターフェイス
class ColorInterface{
  //Dataインスタンス
  constructor(x, y, id, label, r, g, b){
    this.x = x;
    this.y = y;
    // int型 0~255
    this.id = id;
    this.label = label;
    this.r = r;
    this.g = g;
    this.b = b;
  }
  // GreenのInt値を取得
  getIntG(){
    return Math.round(this.g*ColorInterface.COLOR_MAX);
  }
  // BlueのInt値を取得
  getIntB(){
    return Math.round(this.b*ColorInterface.COLOR_MAX);
  }
  // インターフェイス上の座標から適切なラベルを取得する
  allocateUserLabel(){
    if(this.x < lCanvas.width/2){
      if(this.y < lCanvas.height/2){
        return 0; // 左上
      }else{
        return 1; // 左下
      }
    }else{
      if(this.y < lCanvas.height/2){
        return 2; // 右上
      }else{
        return 3; // 右下
      }
    }
  }
}
ColorInterface.COLOR_MAX = 255; //色データの範囲
// このオブジェクトがある配列をコピーする
ColorInterface.copyArray = function(oldArr){
  var newArr = [];
  for (let i = 0; i < oldArr.length; i++) {
    const ele = oldArr[i];
    var obj = new ColorInterface(ele.x, ele.y, ele.id, ele.label,
        ele.r, ele.g, ele.b);
    newArr.push(obj);
  }
  return newArr;
}
ColorInterface.create = function(id, r, g, b){
  var obj = new ColorInterface(null, null, id, null, r, g, b);
  obj.x = ColorInterface.allocateInitialX();
  obj.y = ColorInterface.allocateInitialY();
  obj.label = obj.allocateUserLabel();
  return obj;
}
// ランダムにxの値を返す
ColorInterface.allocateInitialX = function(){
  const xMax = lCanvas.width - radius;
  const xMin = radius;
  return Math.floor( Math.random() * (xMax + 1 - xMin) ) + xMin;
}
// ランダムにyの値を返す
ColorInterface.allocateInitialY = function(){
  const yMax = lCanvas.height - radius;
  const yMin = radius;
  return Math.floor( Math.random() * (yMax + 1 - yMin) ) + yMin ;
}
// クラスタ中心の計算
ColorInterface.calcClusterMean = function(arr){
  var result = {};
  var cnt = {};
  for (let i = 0; i < arr.length; i++) {   
    const ele = arr[i];
    if (ele.label in result) {
      result[ele.label]["g"] += ele.getIntG();
      result[ele.label]["b"] += ele.getIntB();
      cnt[ele.label]++;
    }else{
      result[ele.label] = {};
      result[ele.label]["g"] = ele.getIntG();
      result[ele.label]["b"] = ele.getIntB();
      cnt[ele.label] = 1;
    }
  }
  for (const key in cnt) {
    result[key]["g"] = Math.round(result[key]["g"] / cnt[key]);
    result[key]["b"] = Math.round(result[key]["b"] / cnt[key]);
  }
  return result;
}
// 軌跡データの作成
// init: 初期状態, history: 変更の差分
ColorInterface.getTrajectory = function(init, history){
  var ifTrajectory = [];
  var colorPosDataTmp = ColorInterface.copyArray(init);
  ifTrajectory.push(ColorInterface.copyArray(init));
  for(let i = 0; i < history.length; i++){
    var interface = history[i];
    for(let key in colorPosDataTmp){
      if(colorPosDataTmp[key].id == interface.id){
        colorPosDataTmp[key].x = interface.x;
        colorPosDataTmp[key].y = interface.y;
        break;
      }
    }
    ifTrajectory.push(ColorInterface.copyArray(colorPosDataTmp));
  }
  return ifTrajectory;
}
// 座標から、対応するColorInterfaceのインデックスを取得
ColorInterface.findCircle = function(arr, x, y, r){
  var res = null;
  for (let i = 0; i < arr.length; i++) {
    const ele = arr[i];
    if(Math.sqrt(Math.pow(ele.x - x, 2) + Math.pow(ele.y - y, 2)) < r){
      res = i;
    }
  }
  return res;
}