#!/bin/bash
rm -r docs
node_modules/.bin/tsc --outDir tmp
sleep 5
node_modules/.bin/jsdoc -R README.md -r -d docs ./tmp
rm -r tmp