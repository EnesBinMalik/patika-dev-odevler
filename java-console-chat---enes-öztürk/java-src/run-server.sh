#!/usr/bin/env bash
# Java Chat Sunucusunu Başlatma Scripti - Enes Öztürk
PORT=${1:-5000}
echo "Java Chat Sunucusu Başlatılıyor (Port: $PORT)..."
java -Dfile.encoding=UTF-8 ChatServer $PORT
