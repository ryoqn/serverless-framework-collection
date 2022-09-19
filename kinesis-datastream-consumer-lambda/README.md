## 準備

### nodeのローカル環境構築
```sh
nodenv local <node_version>
```

```sh
npm init -y
```

### サーバレスフレームワークのインストール
```sh
npm install serverless
```

### プロジェクトの作成
```sh
npx sls create --template aws-nodejs --name kinesis-datastream-consumer-lambda
```

## ローカル実行方法
### プロファイル設定
```sh
export AWS_PROFILE=<profile>
```
### プラグインのインストール
serverless-offline
```sh
npm install serverless-offline -D
```
serverless-offline-kinesis
```sh
npm install serverless-offline-kinesis-streams -D
```
### serverless.ymlに追記
※下記順番で書かないとイベントハンドラが呼び出されない
```yml
plugins
    - serverless-offline-kinesis-streams
    - serverless-offline
```

### レコード送信
```shell
 /bin/bash shell/put_record.sh
```
### コンシューマー起動
#### コンソールから
 ```sh
export AWS_SDK_LOAD_CONFIG=1
npx sls offline start -s <stage>
```
### IDEから(IntelliJ IDEA)
実行構成で以下を設定しDebugを実行するとステップ実行可能
* node.jsの実行環境を作成
* nodeインタープリター：ローカルのnode選択
* 作業ディレクトリ：当該ディレクトリ
* JavaScriptファイル：node_module/serverless/bin/serverless.js
* アプリケーションパラメータ：offline -s local
* 環境変数： AWS_SDK_LOADING_CONFIG=1
* .env.local に AWS_PROFILE=<YOUR_PROFILE>

### 参考
https://www.npmjs.com/package/serverless-offline-kinesis-streams  
https://github.com/tylerzey/serverless-offline-kinesis-streams#readme
