/**
 * ============================================================================
 * Proje Adı   : Java Konsol Chat Uygulaması (Çok İplikli & Soket Mimarisi)
 * Geliştirici : Enes Öztürk
 * İletişim    : enesbino38@gmail.com
 * Açıklama    : İstemci (Client) programı. Sunucuya bağlanır ve iki bağımsız
 *               İplik (Thread) kullanır:
 *               1. Okuma İpliği (Sunucudan gelen mesajları ekrana yazar)
 *               2. Yazma İpliği (Kullanıcının yazdığı mesajları sunucuya iletir)
 * ============================================================================
 */

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class ChatClient {

    public static final String DEFAULT_HOST = "localhost";
    public static final int DEFAULT_PORT = 5000;

    // ANSI Renk Kodları (Terminal renklendirme için)
    public static final String ANSI_RESET = "\u001B[0m";
    public static final String ANSI_CYAN = "\u001B[36m";
    public static final String ANSI_GREEN = "\u001B[32m";
    public static final String ANSI_YELLOW = "\u001B[33m";
    public static final String ANSI_PURPLE = "\u001B[35m";
    public static final String ANSI_RED = "\u001B[31m";
    public static final String ANSI_BOLD = "\u001B[1m";

    private static volatile boolean isRunning = true;
    private static Socket socket;
    private static BufferedReader serverIn;
    private static PrintWriter serverOut;

    public static void main(String[] args) {
        String host = DEFAULT_HOST;
        int port = DEFAULT_PORT;

        printBanner();

        Scanner consoleScanner = new Scanner(System.in, StandardCharsets.UTF_8.name());

        // Komut satırı argümanları yoksa kullanıcıdan al
        if (args.length >= 2) {
            host = args[0];
            try {
                port = Integer.parseInt(args[1]);
            } catch (NumberFormatException e) {
                System.out.println(ANSI_YELLOW + "Geçersiz port! Varsayılan port (5000) kullanılıyor." + ANSI_RESET);
            }
        } else if (args.length == 1) {
            host = args[0];
        } else {
            System.out.print("Sunucu IP veya Host Adresi [Varsayılan: " + DEFAULT_HOST + "]: ");
            String hostInput = consoleScanner.nextLine().trim();
            if (!hostInput.isEmpty()) {
                host = hostInput;
            }

            System.out.print("Sunucu Port Numarası [Varsayılan: " + DEFAULT_PORT + "]: ");
            String portInput = consoleScanner.nextLine().trim();
            if (!portInput.isEmpty()) {
                try {
                    port = Integer.parseInt(portInput);
                } catch (NumberFormatException e) {
                    System.out.println(ANSI_YELLOW + "Geçersiz port! Varsayılan (5000) kullanılıyor." + ANSI_RESET);
                }
            }
        }

        System.out.println(ANSI_CYAN + "\n[" + host + ":" + port + "] sunucusuna bağlanılıyor..." + ANSI_RESET);

        try {
            // TCP Soket Bağlantısının kurulması
            socket = new Socket(host, port);
            System.out.println(ANSI_GREEN + "✔ Sunucuya başarıyla bağlanıldı!\n" + ANSI_RESET);

            serverIn = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
            serverOut = new PrintWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8), true);

            // ================================================================
            // 1. İPLİK (THREAD): ARKA PLANDA SUNUCUDAN GELENLERİ DİNLEYEN İPLİK
            // ================================================================
            Thread readThread = new Thread(() -> {
                try {
                    String incomingMessage;
                    while (isRunning && (incomingMessage = serverIn.readLine()) != null) {
                        printColoredMessage(incomingMessage);
                    }
                } catch (IOException e) {
                    if (isRunning) {
                        System.out.println(ANSI_RED + "\n[BİLGİ] Sunucu ile bağlantı kesildi." + ANSI_RESET);
                    }
                } finally {
                    disconnect();
                }
            }, "Istemci-Okuma-Ipligi");
            
            // Arka plan ipliği (Daemon) olarak başlat
            readThread.setDaemon(true);
            readThread.start();

            // ================================================================
            // 2. İPLİK (THREAD): ANA İPLİK - KULLANICI GİRDİLERİNİ GÖNDEREN DÖNGÜ
            // ================================================================
            while (isRunning && consoleScanner.hasNextLine()) {
                String line = consoleScanner.nextLine();
                if (line == null) break;

                line = line.trim();
                if (line.isEmpty()) continue;

                // Sunucuya soket üzerinden mesajı ilet
                serverOut.println(line);

                // Kullanıcı çıkmak isterse
                if (line.equalsIgnoreCase("/ayril") || line.equalsIgnoreCase("/cikis") || line.equalsIgnoreCase("/quit")) {
                    break;
                }
            }

        } catch (IOException e) {
            System.out.println(ANSI_RED + "Sunucuya bağlanılamadı: " + e.getMessage() + ANSI_RESET);
            System.out.println(ANSI_YELLOW + "İpucu: Sunucunun (ChatServer) açık olduğundan ve IP/Port bilgilerinin doğruluğundan emin olunuz." + ANSI_RESET);
        } finally {
            disconnect();
            consoleScanner.close();
        }
    }

    /**
     * Gelen mesajı içerik tipine göre renklendirerek ekrana basar
     */
    private static void printColoredMessage(String msg) {
        if (msg.contains("[SİSTEM]")) {
            System.out.println(ANSI_CYAN + msg + ANSI_RESET);
        } else if (msg.contains("[HATA]")) {
            System.out.println(ANSI_RED + ANSI_BOLD + msg + ANSI_RESET);
        } else if (msg.contains("[ÖZEL MESAJ]")) {
            System.out.println(ANSI_PURPLE + ANSI_BOLD + msg + ANSI_RESET);
        } else if (msg.contains(">>>") || msg.contains("katıldı")) {
            System.out.println(ANSI_GREEN + msg + ANSI_RESET);
        } else if (msg.contains("<<<") || msg.contains("ayrıldı")) {
            System.out.println(ANSI_YELLOW + msg + ANSI_RESET);
        } else {
            System.out.println(msg);
        }
    }

    /**
     * Bağlantıyı güvenle kapatır
     */
    private static synchronized void disconnect() {
        if (!isRunning) return;
        isRunning = false;
        try {
            if (serverIn != null) serverIn.close();
            if (serverOut != null) serverOut.close();
            if (socket != null && !socket.isClosed()) socket.close();
        } catch (IOException ignored) {}
        System.out.println(ANSI_CYAN + "Program sonlandırıldı. İyi günler dileriz!" + ANSI_RESET);
    }

    private static void printBanner() {
        System.out.println(ANSI_CYAN + "╔════════════════════════════════════════════════════════════╗");
        System.out.println("║   JAVA MULTI-THREAD CONSOLE CHAT - İSTEMCİ (CLIENT)        ║");
        System.out.println("║   Geliştirici : Enes Öztürk                                ║");
        System.out.println("║   Mimari      : Java Sockets & İplikler (Threads)          ║");
        System.out.println("╚════════════════════════════════════════════════════════════╝" + ANSI_RESET);
    }
}
