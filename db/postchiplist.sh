#!/bin/bash

# METHOD="POST"
# HEADER0="\"Content-Type: application/json\""
# FILE="chips.json"
# URL="https://byui-cs313-downerj-prj2.herokuapp.com/library/chiplist"
# echo "curl -X $METHOD -H $HEADER0 -d @$FILE $URL"
# curl -X $METHOD -H $HEADER -d @$FILE $URL

for f in ./json/chips*.json
do
    echo -ne "\ncURL: $f\n"
    curl -X POST \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -d @$f \
        "http://localhost:5000/library/chiplist"
    echo -ne "\n"
done
# "https://byui-cs313-downerj-prj2.herokuapp.com/library/chiplist"