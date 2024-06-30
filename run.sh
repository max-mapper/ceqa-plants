#!/bin/bash
set -o xtrace
git clone https://github.com/max-mapper/ceqa-plants/
node index.js
TZ="America/Los_Angeles" todaydir="ceqa-plants/docs/output/$(date +%Y)/$(date +%m)/$(date +%d)"
mkdir -p $todaydir
find zips -iname '*.pdf' -exec sh -c 'pdftotext "{}" - | grep --color --with-filename --label="{}" -f rare.txt' \; > "$todaydir/matches.txt"
node html.js "$todaydir/matches.txt" > "$todaydir/index.html"
tree docs/output -T "CEQA Rare Plant Species Mentions" -H https://max-mapper.github.io/ceqa-plants/output -o ceqa-plants/docs/index.html
cd ceqa-plants
git config credential.helper '!f() { sleep 1; echo "username=${GIT_USER}"; echo "password=${GIT_PASSWORD}"; }; f'
git config --global user.email "maxosmail@gmail.com"
git config --global user.name "Max"
git add .
git commit -m "add daily matches"
git push origin master