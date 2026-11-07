import React from 'react';
import { Wifi, ShieldAlert, Terminal, CheckCircle2, AlertTriangle, Monitor, Laptop } from 'lucide-react';

export const LanGuide: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 lg:p-8">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
          <Wifi className="w-4 h-4" />
          <span>YEREL ALAN AĞI (LAN) REHBERİ</span>
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
          İki veya Daha Fazla Bilgisayarı Aynı Ağda Konuşturma Rehberi
        </h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Kullanıcı isteğinde belirtildiği gibi: Sunucu (Server) bir bilgisayarda, İstemciler (Client) ise aynı yerel ağdaki (LAN) diğer bilgisayarlarda bağımsız çalıştırılabilir. Aşağıdaki 5 adımı takip ediniz.
        </p>
      </div>

      {/* Network Topology Visual */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Fiziksel LAN Bağlantı Düzeni
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center font-mono text-xs">
          {/* Machine 1 */}
          <div className="bg-[#0e1628] border border-emerald-500/40 p-4 rounded-xl space-y-2">
            <Monitor className="w-8 h-8 mx-auto text-emerald-400" />
            <div className="font-bold text-slate-200">1. Bilgisayar (SUNUCU)</div>
            <div className="text-emerald-400 text-[11px]">IP: 192.168.1.105</div>
            <div className="text-slate-400 text-[10px]">Çalıştırır: java ChatServer 5000</div>
          </div>

          {/* Wi-Fi Router */}
          <div className="flex flex-col items-center justify-center space-y-2 py-2">
            <Wifi className="w-8 h-8 text-sky-400" />
            <div className="text-slate-300 font-semibold">Ortak Ev/Ofis Modemi</div>
            <div className="text-slate-500 text-[11px]">(Aynı Wi-Fi veya Ethernet Ağı)</div>
          </div>

          {/* Machine 2 */}
          <div className="bg-[#0e1628] border border-sky-500/40 p-4 rounded-xl space-y-2">
            <Laptop className="w-8 h-8 mx-auto text-sky-400" />
            <div className="font-bold text-slate-200">2. Bilgisayar (İSTEMCİ)</div>
            <div className="text-sky-400 text-[11px]">IP: 192.168.1.120</div>
            <div className="text-slate-400 text-[10px]">Çalıştırır: java ChatClient 192.168.1.105 5000</div>
          </div>
        </div>
      </div>

      {/* Step by step instructions */}
      <div className="space-y-5">
        {/* Step 1 */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              01
            </span>
            <h3 className="text-base font-bold text-slate-100">
              Aynı Ağa Bağlanıldığından Emin Olun
            </h3>
          </div>
          <p className="text-sm text-slate-300 pl-10 leading-relaxed">
            Sunucu ve istemci bilgisayarların aynı Wi-Fi ağına veya aynı modem/switch üzerindeki Ethernet kablosuna bağlı olduğundan emin olunuz. (Farklı misafir ağları istemciler arası iletişimi izole edebilir).
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              02
            </span>
            <h3 className="text-base font-bold text-slate-100">
              Sunucu Bilgisayarın Yerel IP Adresini Öğrenin
            </h3>
          </div>
          <div className="pl-10 space-y-3">
            <p className="text-sm text-slate-300 leading-relaxed">
              Sunucu uygulamasını (<code className="text-emerald-400">ChatServer</code>) çalıştırdığınızda konsolda LAN IP adresiniz otomatik olarak yazdırılacaktır. Manuel öğrenmek isterseniz:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-slate-400 mb-1">Windows (CMD / PowerShell):</div>
                <div className="text-emerald-300">ipconfig</div>
                <div className="text-slate-500 text-[11px] mt-1">IPv4 Address satırını not alınız (Örn: 192.168.1.105)</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-slate-400 mb-1">Linux / macOS Terminal:</div>
                <div className="text-emerald-300">ip a  veya  ifconfig</div>
                <div className="text-slate-500 text-[11px] mt-1">wlan0 veya eth0 altındaki inet adresini not alınız.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              03
            </span>
            <h3 className="text-base font-bold text-slate-100">
              Sunucu Güvenlik Duvarı (Firewall) Ayarı (Önemli!)
            </h3>
          </div>
          <div className="pl-10 space-y-2">
            <p className="text-sm text-slate-300 leading-relaxed">
              Windows veya Mac güvenlik duvarı varsayılan olarak harici bilgisayarların gelen bağlantılarını engelleyebilir.
            </p>
            <div className="p-3.5 bg-amber-950/20 border border-amber-800/40 rounded-lg text-xs text-amber-200/90 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Windows Güvenlik Uyarısı:</strong> ChatServer ilk başlatıldığında açılan &quot;Windows Defender Güvenlik Duvarı bu uygulamanın bazı özelliklerini engelledi&quot; penceresinde <strong className="text-white">&quot;Özel ağlar&quot;</strong> kutucuğunu işaretleyip <strong className="text-white">&quot;Erişime izin ver&quot;</strong> butonuna tıklayınız.
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              04
            </span>
            <h3 className="text-base font-bold text-slate-100">
              1. Bilgisayarda Sunucuyu Başlatın
            </h3>
          </div>
          <div className="pl-10 space-y-2 font-mono text-xs">
            <div className="p-3 bg-[#070a12] border border-slate-800 rounded-lg text-slate-200">
              <span className="text-slate-500"># Sunucu dizininde:</span>
              <div className="text-emerald-400 font-bold mt-1">java -Dfile.encoding=UTF-8 ChatServer 5000</div>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              05
            </span>
            <h3 className="text-base font-bold text-slate-100">
              Diğer Bilgisayarlardan İstemciyi Bağlayın
            </h3>
          </div>
          <div className="pl-10 space-y-2 font-mono text-xs">
            <p className="text-sm font-sans text-slate-300">
              2. ve 3. bilgisayarlarda komut satırına sunucu bilgisayarın IP adresini giriniz:
            </p>
            <div className="p-3 bg-[#070a12] border border-slate-800 rounded-lg text-slate-200">
              <span className="text-slate-500"># İstemci dizininde:</span>
              <div className="text-sky-400 font-bold mt-1">java -Dfile.encoding=UTF-8 ChatClient 192.168.1.105 5000</div>
            </div>
            <div className="text-slate-400 font-sans text-xs pt-1">
              Bağlantı kurulduğunda kullanıcı adı sorulacak, çevrimiçi kullanıcılar listelenecek ve #genel odasına giriş yapılacaktır.
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting Section */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Sık Karşılaşılan Sorunlar ve Çözümleri</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-rose-400 font-bold">java.net.ConnectException: Connection refused</div>
            <div className="text-slate-300 font-sans">
              Sunucu programı ya çalışmıyor ya da belirtilen port numarası yanlış. Sunucunun açık olduğunu teyit ediniz.
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-amber-400 font-bold">java.net.SocketTimeoutException / Bağlantı Zaman Aşımı</div>
            <div className="text-slate-300 font-sans">
              Sunucu bilgisayarın güvenlik duvarı gelen 5000 portunu engelliyor olabilir. Windows Defender Güvenlik Duvarı ayarlarını kontrol ediniz.
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-sky-400 font-bold">java.net.BindException: Address already in use</div>
            <div className="text-slate-300 font-sans">
              5000 portu başka bir program veya önceki açık kalmış sunucu tarafından kullanılıyor. Farklı bir port (örn: 5555 veya 8080) giriniz.
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-emerald-400 font-bold">Türkçe Karakter Problemi (ş, ğ, ç...)</div>
            <div className="text-slate-300 font-sans">
              Windows CMD için çalıştırmadan önce <code className="text-emerald-400">chcp 65001</code> yazınız veya <code className="text-emerald-400">-Dfile.encoding=UTF-8</code> bayrağını kullanınız.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
