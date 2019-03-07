// データの格納
class Data{
  constructor(id, g, b, label){
    this.id = id;
    this.label = label;
    this.g = g;  // 0.0 ~ 1.0の範囲で与えられる
    this.b = b;  //
  }
}

// 左画面の分類操作用インターフェイス
class ColorInterface{
  //Dataインスタンス
  constructor(data){
    this.x = this.allocateInitialX();
    this.y = this.allocateInitialY();
    // int型 0~255
    this.id = data.id;
    this.label = this.allocateUserLabel();
    this.r = fixedR;
    this.g = data.g;
    this.b = data.b;
  }
  // GreenのInt値を取得
  getIntG(){
    return Math.round(this.g*ColorInterface.COLOR_MAX);
  }
  // BlueのInt値を取得
  getIntB(){
    return Math.round(this.b*ColorInterface.COLOR_MAX);
  }
  // 左画面の円の表示場所をランダムにするための初期座標を決める
  allocateInitialX(){
    const xMax = lCanvas.width - radius;
    const xMin = radius;
    return Math.floor( Math.random() * (xMax + 1 - xMin) ) + xMin;
  }
  allocateInitialY(){
    const yMax = lCanvas.height - radius;
    const yMin = radius;
    return Math.floor( Math.random() * (yMax + 1 - yMin) ) + yMin ;
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