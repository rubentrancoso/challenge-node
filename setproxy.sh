#!/bin/bash
npm config set proxy http://username:password@server:8080
npm config set https-proxy http://username:password@server:8080
npm config get | grep server:8080

