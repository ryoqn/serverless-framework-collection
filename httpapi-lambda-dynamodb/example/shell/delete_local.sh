#!/bin/bash

curl -X DELETE http://localhost:3000/user/"$1" -H 'X-My-Token:token'
