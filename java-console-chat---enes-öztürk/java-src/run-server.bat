@echo off
chcp 65001 > nul
set PORT=%1
if "%PORT%"=="" set PORT=5000
echo Java Chat Sunucusu Baslatiliyor (Port: %PORT%)...
java -Dfile.encoding=UTF-8 ChatServer %PORT%
pause
