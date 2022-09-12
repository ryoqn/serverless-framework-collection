## 要件

docker

## 準備

### node のローカル環境構築

```sh
nodenv local <node_version>
```

```sh
npm init -y
```

### サーバレスフレームワークのインストール

```sh
npm install serverless -D
```

### プロジェクトの作成

```sh
npx sls create --template aws-nodejs --name httpapi-lambda
```

### プラグインのインストール

serverless-offline

```sh
npx sls plugin install --name serverless-offline
npx sls plugin install --name serverless-prune-plugin
npx sls plugin install --name serverless-layers
npx sls plugin install --name serverless-dynamodb-local
```

### DynamoDB local のインストール

```sh
npx sls dynamodb install
```

## ローカル実行方法

AWS_SDK_LOADING_CONFIG=1

```sh
npx sls offline start -s local
```
