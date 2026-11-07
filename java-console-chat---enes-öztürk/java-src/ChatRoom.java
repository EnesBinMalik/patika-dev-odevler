/**
 * ============================================================================
 * Proje Adı   : Java Konsol Chat Uygulaması (Çok İplikli & Soket Mimarisi)
 * Geliştirici : Enes Öztürk
 * İletişim    : enesbino38@gmail.com
 * Açıklama    : Sohbet odası (Chat Room) sınıfı. Odadaki kullanıcıları yönetir
 *               ve odaya özel toplu mesaj dağıtımını (broadcast) gerçekleştirir.
 * ============================================================================
 */

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class ChatRoom {

    private final String name;
    private final String description;
    // Eşzamanlı (thread-safe) istemci listesi
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

    /**
     * Odaya yeni bir kullanıcı ekler ve odadaki diğer kullanıcılara duyuru yapar
     */
    public synchronized void addMember(ClientHandler client) {
        if (!members.contains(client)) {
            members.add(client);
            broadcastSystemMessage(">>> @" + client.getUsername() + " odaya katıldı. (" + name + ")");
        }
    }

    /**
     * Kullanıcıyı odadan çıkarır ve odadakilere duyurur
     */
    public synchronized void removeMember(ClientHandler client) {
        if (members.remove(client)) {
            broadcastSystemMessage("<<< @" + client.getUsername() + " odadan ayrıldı. (" + name + ")");
        }
    }

    /**
     * Oda içi mesaj yayını (Tüm üyelere iletir)
     */
    public void broadcast(String senderName, String message) {
        String formatted = "[" + name + "] @" + senderName + ": " + message;
        for (ClientHandler member : members) {
            member.sendMessage(formatted);
        }
    }

    /**
     * Oda içi sistem mesajı yayını
     */
    public void broadcastSystemMessage(String systemMessage) {
        String formatted = "[" + name + "] [SİSTEM] " + systemMessage;
        for (ClientHandler member : members) {
            member.sendMessage(formatted);
        }
    }

    /**
     * Odadaki kullanıcı isimlerinin listesi
     */
    public List<String> getMemberNames() {
        List<String> list = new ArrayList<>();
        for (ClientHandler member : members) {
            if (member.getUsername() != null) {
                list.add(member.getUsername());
            }
        }
        Collections.sort(list);
        return list;
    }

    public int getMemberCount() {
        return members.size();
    }
}
