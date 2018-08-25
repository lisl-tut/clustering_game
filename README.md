# clustering_game's Overview

## Description
一般の方にもクラスタリングを理解してもらうため、
色の分類をするゲームを作成しました。
- 色は数値データとして取り扱うことができる
- 人間の分類に近い精度で自動的に分類するアルゴリズムがある

これらを体感的に学ぶことができます。
計算量が莫大になることを想定して計算をサーバーに任せるスタンスをとりました。

次のような流れになっています。
- 左画面で思ったとおりに色を分類する
- 右画面で自分の分類結果とクラスタリングアルゴリズムの結果を比較する


## Demo
![demo](https://raw.githubusercontent.com/tutlisl/clustering_game/media/demotag1-0.gif)

右画面の黒色のリングが載っている色丸がクラスタの中心を表し、ばってんマークが人間が分類しているクラスタの中心を表しています。
人間の分類とクラスタリングアルゴリズムによる分類が一致していれば、これらが一致することになります。

## Requirement
- Jackson-2.9.0
- Apache-Tomcat-7.0.81

## Install (Windows10)
- [Tomcat7.0 32-bit/64-bit Windows Service Installer](https://tomcat.apache.org/download-70.cgi)をダウンロードする。
- 上記のものをインストールする（このとき詳細な設定は不要なのでNextを押し続ける）
- Winキーを押して出てくるメニューで"Monitor Tomcat"を検索
- GeneralタブのServiceステータスがStartedになっていることを確認（なっていなかったらStartを押す）
- GeneralタブのPath to executableにあるパスを参考にしながら、Tomcat7/webapps ディレクトリ直下に移動して`git clone https://github.com/lisl-tut/clustering_game.git` (Permissionエラーが起きたら管理者権限でgitを使うこと)
- ブラウザ上で[http://localhost:8080/clustering_game/](http://localhost:8080/clustering_game/)にアクセス

※現状Firefoxのみサポート

## Contribution
2017's LISL members
