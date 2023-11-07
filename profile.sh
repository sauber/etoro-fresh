#!/bin/bash

time deno run --allow-read=../etoro-data/data --v8-flags=--prof src/ranking/ranking_bin.ts ../etoro-data/data
isolate=$(ls -t isolate*log | head -1)
node --prof-process $isolate > profile.txt
rm $isolate