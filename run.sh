#!/bin/bash
npm config get | grep proxy
npm config set registry "http://registry.npmjs.org/"
# rm -rf node_modules/
npm cache verify
npm update
node app.js
