#!/bin/bash

curl -vso /dev/null -X POST http://localhost:3000/user -H 'X-My-Token:token' -H 'Content-Type: application/json' -d @./example/json/create.json
