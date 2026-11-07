/**
 * ============================================================================
 * Proje Adı   : Java Konsol Chat Uygulaması (Çok İplikli & Soket Mimarisi)
 * Geliştirici : Enes Öztürk
 * İletişim    : enesbino38@gmail.com
 * Açıklama    : Her bir bağlı istemci için bağımsız çalışan İplik (Thread) işleyicisi.
 *               Gelen mesajları dinler, komutları çözümler ve odaya dağıtır.
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
            // Soket Girdi/Çıktı Akışları (UTF-8 formatında Türkçe karakter desteği)
            in = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
            out = new PrintWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8), true);

            // Hoşgeldin mesajı ve yazar imzası
            sendBanner();

            // 1. AŞAMA: Kullanıcı adı isteme ve doğrulama döngüsü
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

            // 2. AŞAMA: Çevrimiçi kullanıcıların listesini yeni gelen kullanıcıya ilet
            sendOnlineUsersList();

            // 3. AŞAMA: Varsayılan genel odaya (#genel) otomatik katıl
            joinRoom("#genel");

            // Komut rehberi hatırlatması
            out.println("[BİLGİ] Komut listesini görmek için /yardim yazabilirsiniz.");
            out.println("────────────────────────────────────────────────────────────");

            // 4. AŞAMA: Ana Mesaj Dinleme Döngüsü (İplik bu döngüde dinleme yapar)
            String message;
            while (isConnected && (message = in.readLine()) != null) {
                message = message.trim();
                if (message.isEmpty()) {
                    continue;
                }

                // Komut kontrolü
                if (message.startsWith("/")) {
                    handleCommand(message);
                } else {
                    // Normal mesaj -> kullanıcının bulunduğu odaya yayınla
                    if (currentRoom != null) {
                        currentRoom.broadcast(username, message);
                    } else {
                        out.println("[HATA] Şu anda bir odada değilsiniz. /katil <oda> komutunu kullanınız.");
                    }
                }
            }

        } catch (IOException e) {
            // Bağlantı koptu veya istemci kapandı
        } finally {
            closeConnection();
        }
    }

    /**
     * İstemci komutlarını işler
     */
    private void handleCommand(String commandLine) {
        String[] parts = commandLine.split("\\s+", 3);
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
                if (parts.length < 2) {
                    out.println("[HATA] Kullanım: /katil <oda_adi>");
                } else {
                    joinRoom(parts[1]);
                }
                break;

            case "/olustur":
            case "/create":
                if (parts.length < 2) {
                    out.println("[HATA] Kullanım: /olustur <oda_adi>");
                } else {
                    createAndJoinRoom(parts[1]);
                }
                break;

            case "/fildisi":
            case "/pm":
            case "/msg":
                if (parts.length < 3) {
                    out.println("[HATA] Kullanım: /pm <kullanici_adi> <mesaj>");
                } else {
                    String targetUser = parts[1];
                    String privateMsg = parts[2];
                    boolean success = ChatServer.sendPrivateMessage(this.username, targetUser, privateMsg);
                    if (success) {
                        out.println("[ÖZEL MESAJ] Siz -> @" + targetUser + ": " + privateMsg);
                    } else {
                        out.println("[HATA] @" + targetUser + " adında çevrimiçi bir kullanıcı bulunamadı.");
                    }
                }
                break;

            case "/ayril":
            case "/cikis":
            case "/quit":
            case "/exit":
                out.println("[SİSTEM] Sohbetten ayrılıyorsunuz. Hoşça kalın!");
                closeConnection();
                break;

            default:
                out.println("[HATA] Bilinmeyen komut: '" + command + "'. Komutlar için /yardim yazınız.");
                break;
        }
    }

    /**
     * Belirtilen odaya geçiş yapar
     */
    private void joinRoom(String roomName) {
        String targetRoomName = roomName.startsWith("#") ? roomName.toLowerCase() : "#" + roomName.toLowerCase();

        ChatRoom targetRoom = ChatServer.getRoom(targetRoomName);
        if (targetRoom == null) {
            out.println("[HATA] '" + targetRoomName + "' adında bir oda bulunamadı. Yeni açmak için: /olustur " + targetRoomName);
            return;
        }

        // Mevcut odadan ayrıl
        if (currentRoom != null) {
            currentRoom.removeMember(this);
        }

        // Yeni odaya katıl
        this.currentRoom = targetRoom;
        this.currentRoom.addMember(this);

        out.println("[SİSTEM] '" + currentRoom.getName() + "' odasına katıldınız! (" + currentRoom.getDescription() + ")");
        out.println("[SİSTEM] Odadaki Üyeler (" + currentRoom.getMemberCount() + "): " + currentRoom.getMemberNames());
    }

    /**
     * Yeni oda oluşturur ve içine katılır
     */
    private void createAndJoinRoom(String roomName) {
        String targetRoomName = roomName.startsWith("#") ? roomName.toLowerCase() : "#" + roomName.toLowerCase();
        ChatRoom room = ChatServer.getOrCreateRoom(targetRoomName);
        out.println("[SİSTEM] '" + targetRoomName + "' odası hazırlandı.");
        joinRoom(targetRoomName);
    }

    /**
     * Çevrimiçi tüm kullanıcıların listesini gönderir
     */
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

    /**
     * Oda listesini gönderir
     */
    private void sendRoomList() {
        Collection<ChatRoom> rooms = ChatServer.getAllRooms();
        out.println("┌── AKTİF SOHBET ODALARI ─────────────────────────────────────┐");
        for (ChatRoom room : rooms) {
            String activeMarker = (currentRoom != null && currentRoom.getName().equalsIgnoreCase(room.getName())) ? " (Şu an buradasınız)" : "";
            out.printf("│  %-15s │ %-2d Üye │ %-24s%s%n", 
                room.getName(), room.getMemberCount(), room.getDescription(), activeMarker);
        }
        out.println("└─────────────────────────────────────────────────────────────┘");
    }

    /**
     * Detaylı kullanıcı listesini gönderir
     */
    private void sendUserList() {
        sendOnlineUsersList();
        if (currentRoom != null) {
            out.println("[SİSTEM] Bulunduğunuz Odanın (" + currentRoom.getName() + ") Üyeleri: " + currentRoom.getMemberNames());
        }
    }

    /**
     * Komut listesini yazdırır
     */
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

    /**
     * Hoşgeldin başlığı
     */
    private void sendBanner() {
        out.println("╔════════════════════════════════════════════════════════════╗");
        out.println("║   JAVA MULTI-THREAD CONSOLE CHAT'E HOŞ GELDİNİZ!           ║");
        out.println("║   Geliştirici : Enes Öztürk                                ║");
        out.println("║   Altyapı     : Java Sockets & Multithreading (İplikler)   ║");
        out.println("╚════════════════════════════════════════════════════════════╝");
    }

    /**
     * İstemciye tek satırlık mesaj iletir
     */
    public void sendMessage(String message) {
        if (out != null) {
            out.println(message);
        }
    }

    /**
     * Soket ve iplik kaynaklarını temizleyerek bağlantıyı sonlandırır
     */
    public synchronized void closeConnection() {
        if (!isConnected) return;
        isConnected = false;

        // Odadan ayrılma
        if (currentRoom != null) {
            currentRoom.removeMember(this);
        }

        // Sunucudan kaydı silme
        if (username != null) {
            ChatServer.unregisterUser(username);
        }

        // Akışları ve soketi kapatma
        try {
            if (in != null) in.close();
            if (out != null) out.close();
            if (socket != null && !socket.isClosed()) socket.close();
        } catch (IOException ignored) {}
    }
}
