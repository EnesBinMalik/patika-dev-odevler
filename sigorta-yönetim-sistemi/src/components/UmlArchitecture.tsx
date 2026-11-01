import React, { useState } from 'react';
import { AccountManager, Individual, User } from '../types/insurance';
import {
  Layers,
  GitFork,
  Database,
  Shield,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface UmlArchitectureProps {
  accountManager: AccountManager;
  onRefresh: () => void;
}

export const UmlArchitecture: React.FC<UmlArchitectureProps> = ({
  accountManager,
  onRefresh,
}) => {
  const [testEmail, setTestEmail] = useState('');
  const [duplicateMessage, setDuplicateMessage] = useState<{
    success: boolean;
    text: string;
  } | null>(null);

  const handleTestTreeSetAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail.trim()) return;

    const dummyUser = new User(
      'Test',
      'Kullanıcı',
      testEmail.trim(),
      '12345',
      'Test Mesleği',
      30
    );
    const newAcc = new Individual(dummyUser);

    const added = accountManager.addAccount(newAcc);
    if (added) {
      setDuplicateMessage({
        success: true,
        text: `[TreeSet Başarılı] "${testEmail.trim()}" eklendi ve compareTo() ile alfabetik sıraya yerleştirildi.`,
      });
      onRefresh();
    } else {
      setDuplicateMessage({
        success: false,
        text: `[TreeSet Engellendi] "${testEmail.trim()}" zaten listede var! equals() ve compareTo() çakışmayı tespit etti, kopya kayıt reddedildi.`,
      });
    }
    setTestEmail('');
  };

  const currentAccounts = accountManager.getAccounts();

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">
            OOP Mimarisi, UML ve TreeSet Analizi
          </h2>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Nesne yönelimli programlama (OOP) prensipleri: Aggregation, Abstraction, Polymorphism, Interface, Exception Handling ve TreeSet sıralama mekanizması.
        </p>
      </div>

      {/* 4 Ana OOP Prensip Kartı */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Aggregation */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">1. Aggregation (Birliktelik)</h3>
              <span className="text-[10px] text-slate-500 font-mono">Account ──◇ User</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            `Account` sınıfı içinde `User` referansı bulunur. User bağımsız bir nesnedir; hesap silinse dahi kullanıcı kişi bilgileri konsept olarak varlığını sürdürebilir.
          </p>
        </div>

        {/* 2. Abstraction & Polymorphism */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <GitFork className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">2. Soyutlama (Abstract)</h3>
              <span className="text-[10px] text-slate-500 font-mono">Insurance & Account</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            `Insurance.calculate()` ve `Account.addInsurance()` soyuttur. Alt sınıflar (Individual %20 vs Enterprise %8 marj) bu metotları kendine göre doldurur.
          </p>
        </div>

        {/* 3. Interface & Static Utility */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">3. Interface Sözleşmesi</h3>
              <span className="text-[10px] text-slate-500 font-mono">&lt;&lt;interface&gt;&gt; Address</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            `Address` arayüzü ortak sözleşmeyi çizer. `HomeAddress` ve `BusinessAddress` bunu uygular. `AddressManager` ise statik ekleme/silme fonksiyonlarını yürütür.
          </p>
        </div>

        {/* 4. TreeSet & Comparable */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">4. TreeSet & Sıralama</h3>
              <span className="text-[10px] text-slate-500 font-mono">Comparable&lt;Account&gt;</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            `AccountManager` hesapları `TreeSet` içinde saklar. Bu nedenle `Account` sınıfı `Comparable&lt;Account&gt;`, `compareTo()`, `hashCode()` ve `equals()` içerir.
          </p>
        </div>
      </div>

      {/* UML Sınıf Diyagramı Görselleştirmesi */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          İnteraktif UML Sınıf & İlişki Şeması
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolon 1: Kullanıcı & Adres Hiyerarşisi */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-200/80">
                <span className="text-xs font-bold text-indigo-950">&lt;&lt;interface&gt;&gt; Address</span>
                <span className="text-[10px] text-indigo-600">Interface</span>
              </div>
              <ul className="text-[11px] font-mono text-indigo-900 space-y-1">
                <li>+ getAddressInfo(): String</li>
                <li>+ getAddressType(): String</li>
                <li>+ getCity(): String</li>
                <li>+ getDistrict(): String</li>
              </ul>
            </div>

            <div className="flex justify-center text-slate-400">
              <span className="text-xs font-mono">▲ implements</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-[11px] font-bold text-slate-900 block">HomeAddress</span>
                <span className="text-[10px] text-slate-500">Ev Adresi Detayları</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="text-[11px] font-bold text-slate-900 block">BusinessAddress</span>
                <span className="text-[10px] text-slate-500">İş / Şirket Bilgileri</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900 pb-1 mb-1 border-b border-slate-200">
                <span>AddressManager</span>
                <span className="text-[10px] text-slate-500 font-mono">Static Utility</span>
              </div>
              <p className="text-[11px] font-mono text-slate-600">
                + static addAddress(User, Address): void<br />
                + static removeAddress(User, Address): boolean
              </p>
            </div>
          </div>

          {/* Kolon 2: Account & Subclasses (Merkez) */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl border-2 border-indigo-600 bg-white shadow-sm">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-indigo-900">&lt;&lt;abstract&gt;&gt; Account</span>
                <span className="text-[10px] text-slate-500 font-mono">implements Comparable</span>
              </div>
              <div className="text-[11px] font-mono text-slate-700 space-y-1 mb-2">
                <div>- authStatus: AuthenticationStatus</div>
                <div className="text-indigo-700 font-semibold">- user: User (◇ Aggregation)</div>
                <div>- insuranceList: ArrayList&lt;Insurance&gt;</div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-600 space-y-1">
                <div>+ login(email, pwd) throws InvalidAuth</div>
                <div>+ final showUserInfo(): void</div>
                <div>+ addAddress(addr): void</div>
                <div>+ removeAddress(addr): boolean</div>
                <div className="text-indigo-600 font-semibold">+ abstract addInsurance(ins): void</div>
                <div>+ compareTo(other): int</div>
                <div>+ equals(o) & hashCode()</div>
              </div>
            </div>

            <div className="flex justify-center text-slate-400">
              <span className="text-xs font-mono">▲ extends</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/60">
                <span className="text-xs font-bold text-blue-900 block">Individual</span>
                <span className="text-[11px] text-blue-700 font-mono mt-1 block">
                  Kar Marjı: %20 (1.20x)
                </span>
                <span className="text-[10px] text-slate-600 block mt-0.5">
                  @Override addInsurance()
                </span>
              </div>

              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/60">
                <span className="text-xs font-bold text-emerald-900 block">Enterprise</span>
                <span className="text-[11px] text-emerald-700 font-mono mt-1 block">
                  Kurumsal Marj: %8 (1.08x)
                </span>
                <span className="text-[10px] text-slate-600 block mt-0.5">
                  @Override addInsurance()
                </span>
              </div>
            </div>
          </div>

          {/* Kolon 3: Insurance & Subclasses */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200">
                <span className="text-xs font-bold text-amber-950">&lt;&lt;abstract&gt;&gt; Insurance</span>
                <span className="text-[10px] text-amber-700 font-mono">Polymorphic Base</span>
              </div>
              <ul className="text-[11px] font-mono text-amber-900 space-y-1">
                <li>- name: String</li>
                <li>- price: double</li>
                <li>- startDate: Date</li>
                <li>- endDate: Date</li>
                <li className="font-bold text-amber-800 pt-1">+ abstract calculate(): double</li>
              </ul>
            </div>

            <div className="flex justify-center text-slate-400">
              <span className="text-xs font-mono">▲ extends</span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs flex items-center justify-between">
                <span className="font-bold text-slate-900">HealthInsurance</span>
                <span className="text-[10px] text-slate-500 font-mono">Yaş / Kronik Risk</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs flex items-center justify-between">
                <span className="font-bold text-slate-900">ResidenceInsurance</span>
                <span className="text-[10px] text-slate-500 font-mono">m² / Bina Yaşı / Deprem</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs flex items-center justify-between">
                <span className="font-bold text-slate-900">TravelInsurance</span>
                <span className="text-[10px] text-slate-500 font-mono">Gün / Schengen / Kişi</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs flex items-center justify-between">
                <span className="font-bold text-slate-900">CarInsurance</span>
                <span className="text-[10px] text-slate-500 font-mono">Kasko Bedeli / Hasar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TreeSet Canlı Test ve Analiz Bölümü */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              AccountManager & TreeSet&lt;Account&gt; Canlı Sıralama Monitörü
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              TreeSet elemanları `Comparable&lt;Account&gt;` ve `compareTo()` sayesinde e-posta adreslerine göre otomatik A-Z sıralanır.
            </p>
          </div>
        </div>

        {/* Live TreeSet Accounts Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Sıra</th>
                <th className="py-2.5 px-3">E-Posta (compareTo Doğal Sırası)</th>
                <th className="py-2.5 px-3">Müşteri Adı</th>
                <th className="py-2.5 px-3">Hesap Türü</th>
                <th className="py-2.5 px-3">Poliçe Sayısı</th>
                <th className="py-2.5 px-3">Adres Sayısı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentAccounts.map((acc, index) => (
                <tr key={acc.user.email} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-mono text-slate-400">{index + 1}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                    {acc.user.email}
                  </td>
                  <td className="py-2.5 px-3 text-slate-800">{acc.user.getFullName()}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        acc.accountType === 'INDIVIDUAL'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {acc.accountType === 'INDIVIDUAL' ? 'Bireysel' : 'Kurumsal'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600">
                    {acc.insuranceList.length} adet
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600">
                    {acc.user.addressList.length} adet
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Canlı TreeSet Ekleme / Kopya Testi */}
        <div className="pt-2">
          <form
            onSubmit={handleTestTreeSetAdd}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          >
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Test için e-posta girin (örn: berrin@test.com veya ahmet@gmail.com)"
              className="text-xs px-3 py-2 border border-slate-200 rounded-lg flex-1 focus:outline-hidden focus:border-indigo-600"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              TreeSet'e Ekle ve Sırala
            </button>
          </form>

          {duplicateMessage && (
            <div
              className={`mt-3 p-3 rounded-lg text-xs flex items-start gap-2 ${
                duplicateMessage.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {duplicateMessage.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{duplicateMessage.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
