#!/usr/bin/env bash
# Java Console Chat Derleme Scripti - Enes Öztürk
echo "========================================="
echo "Java Dosyaları Derleniyor (UTF-8)..."
echo "Geliştirici: Enes Öztürk"
echo "========================================="
javac -encoding UTF-8 *.java
if [ $? -eq 0 ]; then
    echo "✔ Derleme başarılı! ChatServer veya ChatClient çalıştırılabilir."
else
    echo "✖ Derleme hatası oluştu!"
fi
