/**
 * ============================================================================
 * Proje Adı   : Java Konsol Chat Uygulaması (Çok İplikli & Soket Mimarisi)
 * Geliştirici : Enes Öztürk
 * İletişim    : enesbino38@gmail.com
 * Açıklama    : Çoklu sohbet odaları, çevrimiçi kullanıcı takibi ve LAN desteği
 *               sunan ana Java sunucu programı.
 * ============================================================================
 */

import java.io.IOException;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.ServerSocket;
import java.net.Socket;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class ChatServer {

    // Sunucu varsayılan bağlantı noktası (Port)
    public static final int DEFAULT_PORT = 5000;
    
    // Aktif sohbet odaları (Oda Adı -> ChatRoom nesnesi)
    private static final Map<String, ChatRoom> rooms = new ConcurrentHashMap<>();
    
    // Sunucuya bağlı tüm aktif kullanıcılar (Kullanıcı Adı -> ClientHandler)
    private static final Map<String, ClientHandler> onlineUsers = new ConcurrentHashMap<>();
    
    // Sunucu çalışma durumu bayrağı
    private static volatile boolean isRunning = true;
    private static ServerSocket serverSocket;

    public static void main(String[] args) {
        int port = DEFAULT_PORT;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.out.println("Geçersiz port numarası! Varsayılan port (5000) kullanılıyor.");
            }
        }

        printBanner();
        printNetworkInterfaces(port);

        // Varsayılan genel sohbet odasını oluştur
        rooms.put("#genel", new ChatRoom("#genel", "Genel Sohbet Odası"));

        try {
            serverSocket = new ServerSocket(port);
            log("Sunucu başarıyla başlatıldı. Dinlenen Port: " + port);
            log("İstemci bağlantıları bekleniyor (ServerSocket.accept dinlemede)...");

            // Kapatma kancası (Graceful Shutdown Hook)
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                log("Sunucu kapatılıyor...");
                shutdown();
            }));

            // Ana dinleme döngüsü (Sürekli yeni soket kabul eden ana iplik)
            while (isRunning) {
                try {
                    // Bloklayan çağrı: yeni bir istemci bağlandığında Socket döner
                    Socket clientSocket = serverSocket.accept();
                    
                    String clientIP = clientSocket.getInetAddress().getHostAddress();
                    log("Yeni bir istemci bağlandı! IP: " + clientIP + " (Port: " + clientSocket.getPort() + ")");

                    // Her istemci için bağımsız bir İplik (Thread) başlatılır
                    ClientHandler handler = new ClientHandler(clientSocket);
                    Thread clientThread = new Thread(handler, "Istemci-Ipligi-" + clientSocket.getPort());
                    clientThread.start();

                } catch (IOException e) {
                    if (!isRunning) {
                        break;
                    }
                    log("Bağlantı kabulünde hata: " + e.getMessage());
                }
            }

        } catch (IOException e) {
            log("Sunucu başlatılamadı: " + e.getMessage());
        } finally {
            shutdown();
        }
    }

    /**
     * Kullanıcı kaydı ve takibi
     */
    public static synchronized boolean registerUser(String username, ClientHandler handler) {
        if (username == null || username.trim().isEmpty()) {
            return false;
        }
        String cleanName = username.trim();
        if (onlineUsers.containsKey(cleanName.toLowerCase())) {
            return false; // Bu isim zaten alınmış
        }
        onlineUsers.put(cleanName.toLowerCase(), handler);
        log("Kullanıcı sisteme giriş yaptı: @" + cleanName + " (Toplam Çevrimiçi: " + onlineUsers.size() + ")");
        return true;
    }

    /**
     * Kullanıcı çıkışı
     */
    public static synchronized void unregisterUser(String username) {
        if (username != null) {
            onlineUsers.remove(username.toLowerCase());
            log("Kullanıcı sistemden ayrıldı: @" + username + " (Kalan Çevrimiçi: " + onlineUsers.size() + ")");
        }
    }

    /**
     * Çevrimiçi tüm kullanıcıların listesini döndürür
     */
    public static List<String> getOnlineUsernames() {
        List<String> list = new ArrayList<>();
        for (ClientHandler handler : onlineUsers.values()) {
            if (handler.getUsername() != null) {
                list.add(handler.getUsername());
            }
        }
        Collections.sort(list);
        return list;
    }

    /**
     * Belli bir kullanıcıya özel mesaj (Whisper / PM) gönderir
     */
    public static boolean sendPrivateMessage(String fromUser, String targetUser, String message) {
        ClientHandler targetHandler = onlineUsers.get(targetUser.toLowerCase());
        if (targetHandler != null) {
            targetHandler.sendMessage("[ÖZEL MESAJ] @" + fromUser + " -> Siz: " + message);
            return true;
        }
        return false;
    }

    /**
     * Oda yönetimi: Oda getir veya oluştur
     */
    public static ChatRoom getOrCreateRoom(String roomName) {
        String cleanRoom = roomName.startsWith("#") ? roomName.toLowerCase() : "#" + roomName.toLowerCase();
        return rooms.computeIfAbsent(cleanRoom, name -> new ChatRoom(name, name.substring(1) + " Odası"));
    }

    public static ChatRoom getRoom(String roomName) {
        String cleanRoom = roomName.startsWith("#") ? roomName.toLowerCase() : "#" + roomName.toLowerCase();
        return rooms.get(cleanRoom);
    }

    public static Collection<ChatRoom> getAllRooms() {
        return rooms.values();
    }

    /**
     * Sunucu kapatma işlemi
     */
    public static void shutdown() {
        isRunning = false;
        try {
            // Tüm kullanıcılara kapatma mesajı gönder
            for (ClientHandler handler : onlineUsers.values()) {
                handler.sendMessage("[SİSTEM] Sunucu bakım için kapatılıyor. Bağlantı kesildi.");
                handler.closeConnection();
            }
            if (serverSocket != null && !serverSocket.isClosed()) {
                serverSocket.close();
            }
        } catch (Exception ignored) {}
    }

    /**
     * Zaman damgalı sunucu günlüğü
     */
    public static void log(String message) {
        String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        System.out.println("[" + timestamp + "] [SUNUCU] " + message);
    }

    /**
     * Yerel ağ (LAN) IP adreslerini listeleyerek kullanıcıya kolaylık sağlar
     */
    private static void printNetworkInterfaces(int port) {
        System.out.println("┌────────────────────────────────────────────────────────────┐");
        System.out.println("│  YEREL AĞ (LAN) BAĞLANTI BİLGİLERİ                         │");
        System.out.println("├────────────────────────────────────────────────────────────┤");
        try {
            Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
            boolean found = false;
            while (interfaces.hasMoreElements()) {
                NetworkInterface iface = interfaces.nextElement();
                if (iface.isLoopback() || !iface.isUp()) continue;

                Enumeration<InetAddress> addresses = iface.getInetAddresses();
                while (addresses.hasMoreElements()) {
                    InetAddress addr = addresses.nextElement();
                    // Sadece IPv4 adreslerini göster
                    if (addr.getHostAddress().contains(".") && !addr.isLoopbackAddress()) {
                        System.out.printf("│  ► %-15s : %-15s (Port: %-5d)  │%n", 
                            iface.getDisplayName().length() > 15 ? iface.getName() : iface.getDisplayName(),
                            addr.getHostAddress(), port);
                        found = true;
                    }
                }
            }
            if (!found) {
                System.out.printf("│  ► Yerel Adres   : 127.0.0.1       (Port: %-5d)  │%n", port);
            }
        } catch (Exception e) {
            System.out.printf("│  ► Yerel Adres   : localhost       (Port: %-5d)  │%n", port);
        }
        System.out.println("├────────────────────────────────────────────────────────────┤");
        System.out.println("│  Farklı bilgisayardan bağlanırken yukarıdaki LAN IP'sini  │");
        System.out.println("│  kullanınız: java ChatClient <LAN_IP> " + port + "               │");
        System.out.println("└────────────────────────────────────────────────────────────┘\n");
    }

    private static void printBanner() {
        System.out.println("╔════════════════════════════════════════════════════════════╗");
        System.out.println("║   JAVA MULTI-THREAD CONSOLE CHAT - SUNUCU (SERVER)         ║");
        System.out.println("║   Teknikler : Soket (Socket) & İplik (Multithreading)      ║");
        System.out.println("║   Geliştirici : Enes Öztürk                                ║");
        System.out.println("╚════════════════════════════════════════════════════════════╝\n");
    }
}
