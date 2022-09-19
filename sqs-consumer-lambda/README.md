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
npx sls create --template aws-nodejs --name sqs-consumer-lambda
```

## ローカル実行方法
### プラグインのインストール
serverless-offline
```sh
npm install serverless-offline -D
```
serverless-offline-sqs
```sh
npm install serverless-offline-sqs -D
```
### serverless.ymlに追記
※下記順番で書かないとポーリングが行われない
```yml
plugins
    - serverless-offline-sqs
    - serverless-offline
```
### ElasticMQコンテナ起動
```shell
docker compose up -d
```
### キュー送信
```shell
 /bin/bash shell/send_message.sh
```
### コンシューマー起動
#### コンソールから
 ```sh
export AWS_PROFILE=<profile>
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

### 参考
https://github.com/flocasts/serverless-offline-sqs
