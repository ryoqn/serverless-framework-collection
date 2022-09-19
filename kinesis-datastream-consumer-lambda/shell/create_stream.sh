#!/bin/bash

aws --endpoint-url=http://localhost:4567 kinesis create-stream --stream-name my-kinesis --shard-count 1
