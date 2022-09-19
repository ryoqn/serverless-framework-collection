#!/bin/bash

aws --endpoint-url=http://localhost:4567 kinesis put-record --stream-name my-kinesis --partition-key 123 --data file://json/test.json --cli-binary-format raw-in-base64-out
