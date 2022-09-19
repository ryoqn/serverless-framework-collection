#!/bin/bash
SHARD_ITERATOR=$(aws --endpoint-url=http://localhost:4567 kinesis get-shard-iterator --shard-id shardId-000000000000 --shard-iterator-type TRIM_HORIZON --stream-name my-kinesis | jq -r ".ShardIterator")

aws --endpoint-url=http://localhost:4567 kinesis get-records --shard-iterator "${SHARD_ITERATOR}"
