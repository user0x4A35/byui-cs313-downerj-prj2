#!/bin/sh

# METHOD="POST"
# HEADER0="\"Content-Type: application/json\""
# FILE="chips.json"
# URL="https://byui-cs313-downerj-prj2.herokuapp.com/library/chiplist"
# echo "curl -X $METHOD -H $HEADER0 -d @$FILE $URL"
# curl -X $METHOD -H $HEADER -d @$FILE $URL

for f in ./json/chips*.json
do
    echo "cURL: $f"
    curl -X POST \
        -H "Content-Type: application/json" \
        -d @$f \
        "https://byui-cs313-downerj-prj2.herokuapp.com/library/chiplist"
done