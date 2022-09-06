## 要件
docker

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
npx sls install --name serverless-prune-plugin
npx sls install --name serverless-layers
npx sls install --name serverless-dynamodb-local
```
### DynamoDB localのインストール
```sh
npx sls dynamodb install
```

## ローカル実行方法
AWS_SDK_LOADING_CONFIG=1
```sh
npx sls offline start -s local
```