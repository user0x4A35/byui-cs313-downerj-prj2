#!/bin/sh

curl -X POST -H "Content-Type: application/json" -d @chipsStandard.json "localhost:5000/chiplist"