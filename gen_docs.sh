#!/bin/bash
rm -r docs
node_modules/.bin/tsc --outDir tmp
sleep 5
node_modules/.bin/jsdoc -d docs ./tmp/*.js
rm -r tmp