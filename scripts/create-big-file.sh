#!/usr/bin/env bash

int=1
while(( $int<=200 ))
do
#    sed -e 4a\newline bigfile
    sed -i '$a # This is a test' regular_express.txt
    let "int++"
done