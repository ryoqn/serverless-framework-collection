#!/bin/bash

curl -X PUT http://localhost:3000/user -H 'X-My-Token:token' -H 'Content-Type: application/json' -d @./example/json/update.json
