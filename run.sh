#!/bin/bash
node index.js
find zips -iname '*.pdf' -exec sh -c 'pdftotext "{}" - | grep --color --with-filename --label="{}" -B 3 -A 2 -f rare.txt' \;