#!/bin/bash
mv /d/fanbook/bot_release/mp/138519745866498048/273383374205222914/v1/config /d/fanbook/bot_release/tempConfig
rm -rf /d/fanbook/bot_release/mp/138519745866498048/273383374205222914/v1/* 
npm run build
mkdir -p /d/fanbook/bot_release/mp/138519745866498048/273383374205222914/v1/
mv ./docs/* /d/fanbook/bot_release/mp/138519745866498048/273383374205222914/v1/
mv /d/fanbook/bot_release/tempConfig /d/fanbook/bot_release/mp/138519745866498048/273383374205222914/v1/config