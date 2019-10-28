#!/bin/sh

rm -rf build
mkdir build
cp -R public/ build/

go generate ./ui
