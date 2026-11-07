export interface JavaFileItem {
  name: string;
  category: 'java' | 'script' | 'docs';
  description: string;
  content: string;
}

export const JAVA_PROJECT_FILES: JavaFileItem[] = [
  {
    name: 'ChatServer.java',
    category: 'java',
    description: 'Ana Sunucu Sınıfı - ServerSocket dinleme döngüsü, LAN IP tespiti ve istemci iş parçacığı oluşturma.',
    content: `/**
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

    public static final int DEFAULT_PORT = 5000;
    
    // Aktif sohbet odaları (Oda Adı -> ChatRoom)
    private static final Map<String, ChatRoom> rooms = new ConcurrentHashMap<>();
    
    // Sunucuya bağlı tüm aktif kullanıcılar (Kullanıcı Adı -> ClientHandler)
    private static final Map<String, ClientHandler> onlineUsers = new ConcurrentHashMap<>();
    
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
                    if (!isRunning) break;
                    log("Bağlantı kabulünde hata: " + e.getMessage());
                }
            }

        } catch (IOException e) {
            log("Sunucu başlatılamadı: " + e.getMessage());
        } finally {
            shutdown();
        }
    }

    public static synchronized boolean registerUser(String username, ClientHandler handler) {
        if (username == null || username.trim().isEmpty()) return false;
        String cleanName = username.trim();
        if (onlineUsers.containsKey(cleanName.toLowerCase())) return false;
        onlineUsers.put(cleanName.toLowerCase(), handler);
        log("Kullanıcı sisteme giriş yaptı: @" + cleanName + " (Toplam Çevrimiçi: " + onlineUsers.size() + ")");
        return true;
    }

    public static synchronized void unregisterUser(String username) {
        if (username != null) {
            onlineUsers.remove(username.toLowerCase());
            log("Kullanıcı sistemden ayrıldı: @" + username + " (Kalan Çevrimiçi: " + onlineUsers.size() + ")");
        }
    }

    public static List<String> getOnlineUsernames() {
        List<String> list = new ArrayList<>();
        for (ClientHandler handler : onlineUsers.values()) {
            if (handler.getUsername() != null) list.add(handler.getUsername());
        }
        Collections.sort(list);
        return list;
    }

    public static boolean sendPrivateMessage(String fromUser, String targetUser, String message) {
        ClientHandler targetHandler = onlineUsers.get(targetUser.toLowerCase());
        if (targetHandler != null) {
            targetHandler.sendMessage("[ÖZEL MESAJ] @" + fromUser + " -> Siz: " + message);
            return true;
        }
        return false;
    }

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

    public static void shutdown() {
        isRunning = false;
        try {
            for (ClientHandler handler : onlineUsers.values()) {
                handler.sendMessage("[SİSTEM] Sunucu kapatılıyor. Bağlantı kesildi.");
                handler.closeConnection();
            }
            if (serverSocket != null && !serverSocket.isClosed()) serverSocket.close();
        } catch (Exception ignored) {}
    }

    public static void log(String message) {
        String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        System.out.println("[" + timestamp + "] [SUNUCU] " + message);
    }

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
                    if (addr.getHostAddress().contains(".") && !addr.isLoopbackAddress()) {
                        System.out.printf("│  ► %-15s : %-15s (Port: %-5d)  │%n", 
                            iface.getDisplayName().length() > 15 ? iface.getName() : iface.getDisplayName(),
                            addr.getHostAddress(), port);
                        found = true;
                    }
                }
            }
            if (!found) System.out.printf("│  ► Yerel Adres   : 127.0.0.1       (Port: %-5d)  │%n", port);
        } catch (Exception e) {
            System.out.printf("│  ► Yerel Adres   : localhost       (Port: %-5d)  │%n", port);
        }
        System.out.println("├────────────────────────────────────────────────────────────┤");
        System.out.println("│  Farklı bilgisayardan bağlanırken yukarıdaki LAN IP'sini  │");
        System.out.println("│  kullanınız: java ChatClient <LAN_IP> " + port + "               │");
        System.out.println("└────────────────────────────────────────────────────────────┘\\n");
    }

    private static void printBanner() {
        System.out.println("╔════════════════════════════════════════════════════════════╗");
        System.out.println("║   JAVA MULTI-THREAD CONSOLE CHAT - SUNUCU (SERVER)         ║");
        System.out.println("║   Teknikler : Soket (Socket) & İplik (Multithreading)      ║");
        System.out.println("║   Geliştirici : Enes Öztürk                                ║");
        System.out.println("╚════════════════════════════════════════════════════════════╝\\n");
    }
}`
  },
  {
    name: 'ClientHandler.java',
    category: 'java',
    description: 'İstemci İplik Sınıfı - Runnable arayüzünü uygular. Her istemci için soketi dinler, komutları yönetir ve odaya mesaj yayar.',
    content: `/**
 * ============================================================================
 * Proje Adı   : Java Konsol Chat Uygulaması (Çok İplikli & Soket Mimarisi)
 * Geliştirici : Enes Öztürk
 * İletişim    : enesbino38@gmail.com
 * Açıklama    : Her bir bağlı istemci için bağımsız çalışan İplik (Thread) işleyicisi.
 * ============================================================================
 */

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.List;

public class ClientHandler implements Runnable {

    private final Socket socket;
    private BufferedReader in;
    private PrintWriter out;
    private String username;
    private ChatRoom currentRoom;
    private boolean isConnected = true;

    public ClientHandler(Socket socket) {
        this.socket = socket;
    }

    public String getUsername() {
        return username;
    }

    public ChatRoom getCurrentRoom() {
        return currentRoom;
    }

    @Override
    public void run() {
        try {
            in = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
            out = new PrintWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8), true);

            sendBanner();

            // 1. AŞAMA: Kullanıcı adı alma ve doğrulama
            while (isConnected) {
                out.println("[SİSTEM] Lütfen sohbete katılmak için bir kullanıcı adı giriniz:");
                String inputName = in.readLine();
                if (inputName == null) {
                    closeConnection();
                    return;
                }
                inputName = inputName.trim();
                if (inputName.isEmpty()) {
                    out.println("[HATA] Kullanıcı adı boş olamaz!");
                    continue;
                }
                if (inputName.contains(" ") || inputName.contains("@") || inputName.contains("#")) {
                    out.println("[HATA] Kullanıcı adı boşluk, '@' veya '#' işareti içeremez!");
                    continue;
                }
                if (ChatServer.registerUser(inputName, this)) {
                    this.username = inputName;
                    out.println("[SİSTEM] Hoş geldiniz, @" + this.username + "! Sunucuya başarıyla bağlandınız.");
                    break;
                } else {
                    out.println("[HATA] '" + inputName + "' kullanıcı adı zaten kullanımda. Farklı bir isim deneyiniz.");
                }
            }

            // 2. AŞAMA: Çevrimiçi kullanıcıların listesini gönder
            sendOnlineUsersList();

            // 3. AŞAMA: Varsayılan #genel odasına katıl
            joinRoom("#genel");
            out.println("[BİLGİ] Komut listesini görmek için /yardim yazabilirsiniz.");
            out.println("────────────────────────────────────────────────────────────");

            // 4. AŞAMA: Mesaj Dinleme Döngüsü (İplik bu blokta çalışır)
            String message;
            while (isConnected && (message = in.readLine()) != null) {
                message = message.trim();
                if (message.isEmpty()) continue;

                if (message.startsWith("/")) {
                    handleCommand(message);
                } else {
                    if (currentRoom != null) {
                        currentRoom.broadcast(username, message);
                    } else {
                        out.println("[HATA] Şu anda bir odada değilsiniz. /katil <oda> komutunu kullanınız.");
                    }
                }
            }

        } catch (IOException e) {
            // Bağlantı koptu
        } finally {
            closeConnection();
        }
    }

    private void handleCommand(String commandLine) {
        String[] parts = commandLine.split("\\\\s+", 3);
        String command = parts[0].toLowerCase();

        switch (command) {
            case "/yardim":
            case "/help":
                sendHelp();
                break;
            case "/odalar":
            case "/rooms":
                sendRoomList();
                break;
            case "/kullanicilar":
            case "/users":
                sendUserList();
                break;
            case "/katil":
            case "/join":
                if (parts.length < 2) out.println("[HATA] Kullanım: /katil <oda_adi>");
                else joinRoom(parts[1]);
                break;
            case "/olustur":
            case "/create":
                if (parts.length < 2) out.println("[HATA] Kullanım: /olustur <oda_adi>");
                else createAndJoinRoom(parts[1]);
                break;
            case "/pm":
            case "/msg":
                if (parts.length < 3) out.println("[HATA] Kullanım: /pm <kullanici_adi> <mesaj>");
                else {
                    boolean ok = ChatServer.sendPrivateMessage(this.username, parts[1], parts[2]);
                    if (ok) out.println("[ÖZEL MESAJ] Siz -> @" + parts[1] + ": " + parts[2]);
                    else out.println("[HATA] @" + parts[1] + " adında çevrimiçi kullanıcı bulunamadı.");
                }
                break;
            case "/ayril":
            case "/cikis":
            case "/quit":
                out.println("[SİSTEM] Sohbetten ayrılıyorsunuz. Hoşça kalın!");
                closeConnection();
                break;
            default:
                out.println("[HATA] Bilinmeyen komut. Komut listesi için /yardim yazınız.");
                break;
        }
    }

    private void joinRoom(String roomName) {
        String target = roomName.startsWith("#") ? roomName.toLowerCase() : "#" + roomName.toLowerCase();
        ChatRoom room = ChatServer.getRoom(target);
        if (room == null) {
            out.println("[HATA] '" + target + "' odası bulunamadı. Oluşturmak için: /olustur " + target);
            return;
        }
        if (currentRoom != null) currentRoom.removeMember(this);
        this.currentRoom = room;
        this.currentRoom.addMember(this);
        out.println("[SİSTEM] '" + currentRoom.getName() + "' odasına geçtiniz.");
        out.println("[SİSTEM] Odadaki Üyeler (" + currentRoom.getMemberCount() + "): " + currentRoom.getMemberNames());
    }

    private void createAndJoinRoom(String roomName) {
        String target = roomName.startsWith("#") ? roomName.toLowerCase() : "#" + roomName.toLowerCase();
        ChatRoom room = ChatServer.getOrCreateRoom(target);
        out.println("[SİSTEM] '" + target + "' odası oluşturuldu.");
        joinRoom(target);
    }

    private void sendOnlineUsersList() {
        List<String> users = ChatServer.getOnlineUsernames();
        StringBuilder sb = new StringBuilder();
        sb.append("[SİSTEM] Çevrimiçi Kullanıcılar (").append(users.size()).append("): [");
        for (int i = 0; i < users.size(); i++) {
            sb.append("@").append(users.get(i));
            if (i < users.size() - 1) sb.append(", ");
        }
        sb.append("]");
        out.println(sb.toString());
    }

    private void sendRoomList() {
        Collection<ChatRoom> rooms = ChatServer.getAllRooms();
        out.println("┌── AKTİF SOHBET ODALARI ─────────────────────────────────────┐");
        for (ChatRoom room : rooms) {
            String active = (currentRoom != null && currentRoom.getName().equalsIgnoreCase(room.getName())) ? " (Şu an buradasınız)" : "";
            out.printf("│  %-15s │ %-2d Üye │ %-24s%s%n", room.getName(), room.getMemberCount(), room.getDescription(), active);
        }
        out.println("└─────────────────────────────────────────────────────────────┘");
    }

    private void sendUserList() {
        sendOnlineUsersList();
        if (currentRoom != null) {
            out.println("[SİSTEM] Bulunduğunuz Odanın (" + currentRoom.getName() + ") Üyeleri: " + currentRoom.getMemberNames());
        }
    }

    private void sendHelp() {
        out.println("┌── KULLANILABİLİR KOMUTLAR ──────────────────────────────────┐");
        out.println("│  /odalar                 - Aktif sohbet odalarını listeler  │");
        out.println("│  /olustur <oda_adi>      - Yeni bir sohbet odası oluşturur  │");
        out.println("│  /katil <oda_adi>        - Başka bir sohbet odasına geçer   │");
        out.println("│  /kullanicilar           - Çevrimiçi kullanıcıları gösterir │");
        out.println("│  /pm <kullanici> <mesaj> - Belli bir kullanıcıya özel mesaj │");
        out.println("│  /ayril veya /cikis      - Sohbetten güvenli çıkış yapar    │");
        out.println("│  /yardim                 - Bu yardım menüsünü görüntüler    │");
        out.println("└─────────────────────────────────────────────────────────────┘");
    }

    private void sendBanner() {
        out.println("╔════════════════════════════════════════════════════════════╗");
        out.println("║   JAVA MULTI-THREAD CONSOLE CHAT'E HOŞ GELDİNİZ!           ║");
        out.println("║   Geliştirici : Enes Öztürk                                ║");
        out.println("║   Altyapı     : Java Sockets & Multithreading (İplikler)   ║");
        out.println("╚════════════════════════════════════════════════════════════╝");
    }

    public void sendMessage(String message) {
        if (out != null) out.println(message);
    }

    public synchronized void closeConnection() {
        if (!isConnected) return;
        isConnected = false;
        if (currentRoom != null) currentRoom.removeMember(this);
        if (username != null) ChatServer.unregisterUser(username);
        try {
            if (in != null) in.close();
            if (out != null) out.close();
            if (socket != null && !socket.isClosed()) socket.close();
        } catch (IOException ignored) {}
    }
}`
  },
  {
    name: 'ChatClient.java',
    category: 'java',
    description: 'İstemci Sınıfı - Çift İplik (Dual-Thread) mimarisi ile dinleme ve yazma işlemlerini eşzamanlı yürütür. ANSI renk destekli.',
    content: `/**
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

    public static final String ANSI_RESET = "\\u001B[0m";
    public static final String ANSI_CYAN = "\\u001B[36m";
    public static final String ANSI_GREEN = "\\u001B[32m";
    public static final String ANSI_YELLOW = "\\u001B[33m";
    public static final String ANSI_PURPLE = "\\u001B[35m";
    public static final String ANSI_RED = "\\u001B[31m";
    public static final String ANSI_BOLD = "\\u001B[1m";

    private static volatile boolean isRunning = true;
    private static Socket socket;
    private static BufferedReader serverIn;
    private static PrintWriter serverOut;

    public static void main(String[] args) {
        String host = DEFAULT_HOST;
        int port = DEFAULT_PORT;

        printBanner();

        Scanner consoleScanner = new Scanner(System.in, StandardCharsets.UTF_8.name());

        if (args.length >= 2) {
            host = args[0];
            try {
                port = Integer.parseInt(args[1]);
            } catch (NumberFormatException e) {
                System.out.println(ANSI_YELLOW + "Geçersiz port! Varsayılan (5000) kullanılıyor." + ANSI_RESET);
            }
        } else if (args.length == 1) {
            host = args[0];
        } else {
            System.out.print("Sunucu IP veya Host Adresi [Varsayılan: " + DEFAULT_HOST + "]: ");
            String hostInput = consoleScanner.nextLine().trim();
            if (!hostInput.isEmpty()) host = hostInput;

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

        System.out.println(ANSI_CYAN + "\\n[" + host + ":" + port + "] sunucusuna bağlanılıyor..." + ANSI_RESET);

        try {
            socket = new Socket(host, port);
            System.out.println(ANSI_GREEN + "✔ Sunucuya başarıyla bağlanıldı!\\n" + ANSI_RESET);

            serverIn = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
            serverOut = new PrintWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8), true);

            // 1. İPLİK: Sunucudan gelen mesajları ekrana basan arka plan ipliği
            Thread readThread = new Thread(() -> {
                try {
                    String incomingMessage;
                    while (isRunning && (incomingMessage = serverIn.readLine()) != null) {
                        printColoredMessage(incomingMessage);
                    }
                } catch (IOException e) {
                    if (isRunning) System.out.println(ANSI_RED + "\\n[BİLGİ] Sunucu ile bağlantı kesildi." + ANSI_RESET);
                } finally {
                    disconnect();
                }
            }, "Istemci-Okuma-Ipligi");
            readThread.setDaemon(true);
            readThread.start();

            // 2. İPLİK: Ana iplik - Konsoldan okuyup sunucuya gönderir
            while (isRunning && consoleScanner.hasNextLine()) {
                String line = consoleScanner.nextLine();
                if (line == null) break;
                line = line.trim();
                if (line.isEmpty()) continue;

                serverOut.println(line);

                if (line.equalsIgnoreCase("/ayril") || line.equalsIgnoreCase("/cikis") || line.equalsIgnoreCase("/quit")) {
                    break;
                }
            }

        } catch (IOException e) {
            System.out.println(ANSI_RED + "Sunucuya bağlanılamadı: " + e.getMessage() + ANSI_RESET);
        } finally {
            disconnect();
            consoleScanner.close();
        }
    }

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
}`
  },
  {
    name: 'ChatRoom.java',
    category: 'java',
    description: 'Sohbet Odası Sınıfı - Odadaki istemcileri senkronize şekilde tutar ve oda içi yayın (broadcast) yapar.',
    content: `/**
 * ============================================================================
 * Proje Adı   : Java Konsol Chat Uygulaması (Çok İplikli & Soket Mimarisi)
 * Geliştirici : Enes Öztürk
 * İletişim    : enesbino38@gmail.com
 * Açıklama    : Sohbet odası (Chat Room) sınıfı.
 * ============================================================================
 */

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class ChatRoom {

    private final String name;
    private final String description;
    private final List<ClientHandler> members = new CopyOnWriteArrayList<>();

    public ChatRoom(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public synchronized void addMember(ClientHandler client) {
        if (!members.contains(client)) {
            members.add(client);
            broadcastSystemMessage(">>> @" + client.getUsername() + " odaya katıldı. (" + name + ")");
        }
    }

    public synchronized void removeMember(ClientHandler client) {
        if (members.remove(client)) {
            broadcastSystemMessage("<<< @" + client.getUsername() + " odadan ayrıldı. (" + name + ")");
        }
    }

    public void broadcast(String senderName, String message) {
        String formatted = "[" + name + "] @" + senderName + ": " + message;
        for (ClientHandler member : members) {
            member.sendMessage(formatted);
        }
    }

    public void broadcastSystemMessage(String systemMessage) {
        String formatted = "[" + name + "] [SİSTEM] " + systemMessage;
        for (ClientHandler member : members) {
            member.sendMessage(formatted);
        }
    }

    public List<String> getMemberNames() {
        List<String> list = new ArrayList<>();
        for (ClientHandler member : members) {
            if (member.getUsername() != null) list.add(member.getUsername());
        }
        Collections.sort(list);
        return list;
    }

    public int getMemberCount() {
        return members.size();
    }
}`
  },
  {
    name: 'README.md',
    category: 'docs',
    description: 'Proje kurulum, çalıştırma, mimari ve komut rehberi.',
    content: `# Java Çok İplikli Konsol Chat Uygulaması (LAN Destekli)
Geliştirici: Enes Öztürk
İletişim: enesbino38@gmail.com

## Kurulum ve Çalıştırma
1. Derleme:
   javac -encoding UTF-8 *.java

2. Sunucuyu Başlatma:
   java ChatServer 5000

3. İstemciyi Başlatma (Aynı Bilgisayar):
   java ChatClient localhost 5000

4. İstemciyi Başlatma (LAN Üzerindeki Diğer Bilgisayar):
   java ChatClient 192.168.1.105 5000

## Komutlar:
/odalar, /olustur <oda>, /katil <oda>, /kullanicilar, /pm <kullanici> <mesaj>, /ayril, /yardim`
  },
  {
    name: 'compile.bat',
    category: 'script',
    description: 'Windows için tek tıkla derleme scripti.',
    content: `@echo off
chcp 65001 > nul
echo Java Dosyalari Derleniyor (Enes Ozturk)...
javac -encoding UTF-8 *.java
if %ERRORLEVEL% EQU 0 (
    echo [BASARILI] Derleme tamamlandi!
) else (
    echo [HATA] Derleme hatasi!
)
pause`
  },
  {
    name: 'run-server.bat',
    category: 'script',
    description: 'Windows için sunucu başlatma scripti.',
    content: `@echo off
chcp 65001 > nul
set PORT=%1
if "%PORT%"=="" set PORT=5000
echo Java Chat Sunucusu Baslatiliyor (Port: %PORT%)...
java -Dfile.encoding=UTF-8 ChatServer %PORT%
pause`
  },
  {
    name: 'run-client.bat',
    category: 'script',
    description: 'Windows için istemci başlatma scripti.',
    content: `@echo off
chcp 65001 > nul
set HOST=%1
if "%HOST%"=="" set HOST=localhost
set PORT=%2
if "%PORT%"=="" set PORT=5000
echo Java Chat Istemcisi Baslatiliyor (%HOST%:%PORT%)...
java -Dfile.encoding=UTF-8 ChatClient %HOST% %PORT%
pause`
  }
];
