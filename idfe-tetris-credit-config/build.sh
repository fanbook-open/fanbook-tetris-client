#!/bin/bash
rm -rf /d/fanbook/bot_release/mp/138519745866498048/273383374205222914/v1/config/*
rm -rf build
npm run build
mkdir -p /d/fanbook/bot_release/mp/138519745866498048/273383374205222914/v1/config/
mv ./build/* /d/fanbook/bot_release/mp/138519745866498048/273383374205222914/v1/config/
