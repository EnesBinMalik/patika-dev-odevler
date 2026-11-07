#!/usr/bin/env bash
# Java Chat İstemcisini Başlatma Scripti - Enes Öztürk
HOST=${1:-localhost}
PORT=${2:-5000}
echo "Java Chat İstemcisi Başlatılıyor ($HOST:$PORT)..."
java -Dfile.encoding=UTF-8 ChatClient $HOST $PORT
