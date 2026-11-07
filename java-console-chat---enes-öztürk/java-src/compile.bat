@echo off
chcp 65001 > nul
echo =========================================
echo Java Dosyalari Derleniyor (UTF-8)...
echo Gelistirici: Enes Ozturk
echo =========================================
javac -encoding UTF-8 *.java
if %ERRORLEVEL% EQU 0 (
    echo [BASARILI] Derleme basariyla tamamlandi!
    echo ChatServer veya ChatClient calistirilabilir.
) else (
    echo [HATA] Derleme sirasinda hata olustu! Lutfen JDK yuklu oldugundan emin olunuz.
)
pause
