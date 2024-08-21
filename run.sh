#!/bin/bash
set -o xtrace
git clone https://github.com/max-mapper/ceqa-plants/
node index.js
if [ -z "$(ls -A zips)" ]; then
  echo "No pdfs today"
  exit 0
fi
todaydir="ceqa-plants/docs/output/$(date --date yesterday "+%Y/%m/%d")"
mkdir -p $todaydir
find zips -iname '*.pdf' -exec sh -c 'pdftotext "{}" - | grep --color --with-filename --label="{}" -f rare.txt' \; > "$todaydir/matches.txt"
node html.js "$todaydir/matches.txt" > "$todaydir/index.html"
find "ceqa-plants/docs/output" -size 0 -print -delete
find "ceqa-plants/docs/output" -type d -size 0 -print -delete
cd ceqa-plants
tree docs/output -T "CEQA Rare Plant Species Mentions" -H https://max-mapper.github.io/ceqa-plants/output -o docs/index.html
git config credential.helper '!f() { sleep 1; echo "username=${GIT_USER}"; echo "password=${GIT_PASSWORD}"; }; f'
git config --global user.email "maxosmail@gmail.com"
git config --global user.name "Max"
git add .
git commit -m "add daily matches"
git push origin master