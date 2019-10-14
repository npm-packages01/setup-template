# setup-template

## 概要

　テンプレートファイル展開用コマンド  
　このパッケージを使ってテンプレート用パッケージを作成すると、開発環境の構築が簡単に出来るようになります

## 使い方

- パッケージのインストール  
npm i setup-template

- テンプレート用データの作成
  - template この中に入れたファイルが、インストール時のRootに展開される
  - options
    - package.json ターゲットに対して追加設定を入れておく
    - message.txt  インストール時のメッセージ

- テンプレートパッケージのpackage.jsonに入れておくべき設定  

```json
{
  "scripts": {
    "postinstall": "npx setup-template"
  }
}
```
