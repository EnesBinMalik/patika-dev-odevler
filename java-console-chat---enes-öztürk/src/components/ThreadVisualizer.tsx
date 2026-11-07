import React, { useState } from 'react';
import { Cpu, Network, ArrowRight, CheckCircle2, Shield, Zap, Layers, RefreshCw } from 'lucide-react';

export const ThreadVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [simulatedPacket, setSimulatedPacket] = useState<string>('Merhaba dünya!');

  const steps = [
    {
      id: 1,
      title: '1. ServerSocket Dinleme Döngüsü (Ana Sunucu İpliği)',
      desc: 'ChatServer başlatıldığında belirtilen portta (örn. 5000) bir ServerSocket açılır ve sonsuz bir döngüde serverSocket.accept() çağrısı ile yeni istemcilerin bağlanmasını bekler.',
      javaCode: `// ChatServer.java
ServerSocket serverSocket = new ServerSocket(5000);
while (isRunning) {
    // Bloklayan çağrı: Yeni istemci bağlanana kadar bekler
    Socket clientSocket = serverSocket.accept();
    // Her yeni bağlantı için bağımsız bir İplik (Thread) ayağa kaldırılır!
    ClientHandler handler = new ClientHandler(clientSocket);
    new Thread(handler).start();
}`,
      tag: 'Ana Dinleyici İplik',
    },
    {
      id: 2,
      title: '2. İstemci İş Parçacığı Ayrıştırma (ClientHandler İpliği)',
      desc: 'Her bağlanan kullanıcı için sunucuda bağımsız bir ClientHandler (Runnable) ipliği çalıştırılır. Bir istemcinin mesaj beklemesi veya yavaşlığı diğer kullanıcıları asla etkilemez.',
      javaCode: `// ClientHandler.java
public class ClientHandler implements Runnable {
    private final Socket socket;
    @Override
    public void run() {
        BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
        PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
        // Bu iplik sadece bu kullanıcının soketinden gelenleri okur
        String message;
        while ((message = in.readLine()) != null) {
            broadcastToRoom(message);
        }
    }
}`,
      tag: 'İstemci Başına 1 İplik',
    },
    {
      id: 3,
      title: '3. İstemci Çift İplik Mimarisi (Dual-Thread Client)',
      desc: 'ChatClient konsolunda kullanıcının klavyeden yazı yazması ile sunucudan gelen mesajların eşzamanlı ekrana düşmesi için istemci 2 bağımsız iplik kullanır: Okuma İpliği (ReadThread) ve Yazma İpliği (Main/WriteThread).',
      javaCode: `// ChatClient.java
// 1. İPLİK: Sunucudan gelen mesajları ekrana basan arka plan (Daemon) ipliği
Thread readThread = new Thread(() -> {
    String msg;
    while ((msg = serverIn.readLine()) != null) {
        System.out.println(msg); // Ekran donmadan mesajlar anında akar
    }
});
readThread.setDaemon(true);
readThread.start();

// 2. İPLİK: Ana iplik - Kullanıcının klavye girdisini sunucuya iletir
while (consoleScanner.hasNextLine()) {
    String line = consoleScanner.nextLine();
    serverOut.println(line);
}`,
      tag: 'Eşzamanlı G/Ç',
    },
    {
      id: 4,
      title: '4. Sohbet Odaları ve Eşzamanlı Mesaj Yayını (Broadcast)',
      desc: 'Kullanıcı bir odaya (#genel, #yazilim vb.) katıldığında, sunucu o odaya ait CopyOnWriteArrayList koleksiyonuna istemciyi ekler. Biri mesaj attığında odaya ait tüm ipliklerin soket çıktı akışına iletilir.',
      javaCode: `// ChatRoom.java
public class ChatRoom {
    // Thread-safe eşzamanlı liste
    private final List<ClientHandler> members = new CopyOnWriteArrayList<>();

    public void broadcast(String sender, String message) {
        String formatted = "[" + name + "] @" + sender + ": " + message;
        for (ClientHandler member : members) {
            member.sendMessage(formatted); // Tüm üyelere dağıtılır
        }
    }
}`,
      tag: 'Oda İçi Dağıtım',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Cpu className="w-4 h-4" />
              <span>TEKNİK MİMARİ ANALİZİ</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
              Java Soket (Socket) ve İplik (Multithreading) Mimarisi
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Bu uygulama, ağ programlamasının iki temel sütunu olan <strong className="text-slate-200">TCP/IP Soketler</strong> ve{' '}
              <strong className="text-slate-200">Java Çoklu İş Parçacıkları (Threads)</strong> kullanılarak tasarlanmıştır. Geliştirici:{' '}
              <span className="text-emerald-400 font-medium">Enes Öztürk</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0 font-mono text-xs">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <div className="text-slate-500 text-[11px]">Protokol</div>
              <div className="text-emerald-400 font-bold mt-0.5">TCP/IP Stream</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <div className="text-slate-500 text-[11px]">Eşzamanlılık</div>
              <div className="text-sky-400 font-bold mt-0.5">1 İstemci = 1 İplik</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Architectural Diagram */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Network className="w-5 h-5 text-emerald-400" />
            <span>Ağ ve İplik Akış Şeması (LAN & Thread Topology)</span>
          </h3>
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            Non-Blocking Multi-User Concurrency
          </span>
        </div>

        {/* Dynamic Topology Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Server Box */}
          <div className="lg:col-span-5 bg-[#0e1628] border border-emerald-500/30 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400">
                CHAT SERVER (192.168.1.105:5000)
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/20">
                ServerSocket Dinlemede
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1.5">
                <div className="text-slate-400 font-semibold flex items-center justify-between">
                  <span>Ana Dinleyici İplik (Main Thread):</span>
                  <span className="text-emerald-400 text-[11px]">RUNNABLE</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  serverSocket.accept() çağrısı ile yeni gelen bağlantıları yakalar.
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-2">
                <div className="text-slate-400 font-semibold flex items-center justify-between">
                  <span>İstemci İşleyici İplikleri (Thread Pool):</span>
                  <span className="text-sky-400 text-[11px]">3 Aktif İplik</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-1.5 bg-slate-800/40 rounded text-[11px]">
                    <span className="text-slate-300">İplik-1: ClientHandler (@enes)</span>
                    <span className="text-emerald-400">#genel</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-slate-800/40 rounded text-[11px]">
                    <span className="text-slate-300">İplik-2: ClientHandler (@ayse)</span>
                    <span className="text-emerald-400">#genel</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-slate-800/40 rounded text-[11px]">
                    <span className="text-slate-300">İplik-3: ClientHandler (@mehmet)</span>
                    <span className="text-purple-400">#yazilim</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                <div className="text-slate-400 font-semibold mb-1">Oda Yöneticisi (ConcurrentHashMap):</div>
                <div className="text-slate-400 text-[11px] flex gap-2">
                  <span className="text-emerald-300">#genel (2 üye)</span>
                  <span>·</span>
                  <span className="text-purple-300">#yazilim (1 üye)</span>
                  <span>·</span>
                  <span className="text-amber-300">#oyun (0 üye)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Network Bridge */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-3 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 border border-slate-700 shadow-md">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              TCP/IP Soket Akışı
              <div className="text-[10px] text-slate-500">UTF-8 Çift Yönlü İletişim</div>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-1 rounded">
              LAN / Wi-Fi
            </div>
          </div>

          {/* Client Box */}
          <div className="lg:col-span-5 bg-[#0e1628] border border-sky-500/30 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-400">
                CHAT CLIENT (@enes - 192.168.1.100)
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-500/20">
                Socket Bağlı
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1.5">
                <div className="text-sky-300 font-semibold flex items-center justify-between">
                  <span>1. İplik: ReadThread (Daemon):</span>
                  <span className="text-emerald-400 text-[11px]">Sürekli Dinliyor</span>
                </div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  Sunucudan gelen oda mesajlarını, sistem duyurularını ve özel mesajları anında terminale basar.
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1.5">
                <div className="text-sky-300 font-semibold flex items-center justify-between">
                  <span>2. İplik: Main / WriteThread:</span>
                  <span className="text-emerald-400 text-[11px]">Klavye Girişi</span>
                </div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  Kullanıcının klavyeden yazdığı metinleri ve komutları (/odalar, /katil) PrintWriter üzerinden sunucuya gönderir.
                </div>
              </div>

              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/50 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Bağlantı Portu:</span>
                <span className="text-slate-200">54201 (Ephemeral Port)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white tracking-tight">
          Adım Adım Çalışma Mekanizması & Java Kod Karşılıkları
        </h3>

        {/* Step Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`p-3.5 rounded-xl border text-left transition-all font-mono text-xs ${
                activeStep === s.id
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] text-emerald-400 font-semibold mb-1">{s.tag}</div>
              <div className="font-sans font-medium line-clamp-1">{s.title.split('(')[0]}</div>
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        {(() => {
          const step = steps.find((s) => s.id === activeStep) || steps[0];
          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
              <div className="lg:col-span-5 space-y-3">
                <h4 className="text-base font-bold text-emerald-400">{step.title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{step.desc}</p>
                <div className="pt-2 text-xs text-slate-400 font-mono space-y-1.5 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Enes Öztürk onaylı çok iş parçacıklı standart mimari</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Çoklu platform (Windows, Linux, macOS) uyumlu</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-[#070a12] border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-x-auto shadow-inner">
                <div className="text-slate-500 text-[11px] pb-2 border-b border-slate-800/80 mb-3 flex items-center justify-between">
                  <span>Java Kaynak Kodu Parçası</span>
                  <span className="text-emerald-400">UTF-8</span>
                </div>
                <pre className="text-slate-200 leading-relaxed">{step.javaCode}</pre>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
