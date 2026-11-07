@echo off
chcp 65001 > nul
set HOST=%1
if "%HOST%"=="" set HOST=localhost
set PORT=%2
if "%PORT%"=="" set PORT=5000
echo Java Chat Istemcisi Baslatiliyor (%HOST%:%PORT%)...
java -Dfile.encoding=UTF-8 ChatClient %HOST% %PORT%
pause
