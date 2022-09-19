#!/usr/bin/bash

QUE_NAME=my-queue
SQS_MSG=$(cat << EOS
{
  "sample": "sample"
}
EOS
)

aws sqs send-message \
  --queue-url "http://localhost:9324/000000000000/${QUE_NAME}" \
  --message-body "${SQS_MSG}" \
  --endpoint-url "http://localhost:9324"
