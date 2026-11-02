import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  Truck, 
  BarChart3, 
  Terminal, 
  Code2, 
  ShieldCheck, 
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types/store';

export type ActiveTab = 'inventory' | 'sales' | 'purchases' | 'reports' | 'terminal' | 'code';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewSale: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenNewSale }) => {
  const { currentUser, switchRole, users, setCurrentUser } = useStore();
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const navItems = [
    { id: 'inventory' as ActiveTab, label: 'Envanter', icon: Package },
    { id: 'sales' as ActiveTab, label: 'Satış & Kasa', icon: ShoppingCart },
    { id: 'purchases' as ActiveTab, label: 'Satın Alma', icon: Truck },
    { id: 'reports' as ActiveTab, label: 'Raporlar', icon: BarChart3 },
    { id: 'terminal' as ActiveTab, label: 'Rust Terminal', icon: Terminal },
    { id: 'code' as ActiveTab, label: 'Rust Kodları', icon: Code2 },
  ];

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Manager':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      case 'Cashier':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'Admin': return 'Yönetici (Admin)';
      case 'Manager': return 'Mağaza Müdürü';
      case 'Cashier': return 'Kasiyer';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-mono font-bold text-base group-hover:border-orange-400 transition-colors">
                🦀
              </div>
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                Paslı Mağaza
              </span>
            </button>
            <span className="text-xs text-slate-500 hidden sm:inline-block font-mono">
              / Enes Öztürk
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-800 text-orange-400 border border-slate-700/80 shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action + Role/User Selector */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Sale Button */}
            <button
              onClick={onOpenNewSale}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-500 transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Hızlı Satış</span>
            </button>

            {/* User & Role Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 transition-colors text-xs font-medium"
              >
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <div className="text-left hidden md:block">
                  <div className="font-semibold text-slate-100 leading-tight">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {getRoleLabel(currentUser.role)}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-medium text-slate-400">Aktif Kimlik (RBAC Testi)</p>
                    <p className="text-xs text-slate-200 font-semibold mt-0.5">{currentUser.fullName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{currentUser.email}</p>
                  </div>

                  <div className="p-1">
                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase px-2 py-1">
                      Kullanıcı Değiştir
                    </p>
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          currentUser.id === u.id ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="text-left">
                          <span className="block font-medium">{u.fullName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">@{u.username}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${getRoleBadge(u.role)}`}>
                          {u.role}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-800 p-2 mt-1">
                    <p className="text-[11px] text-slate-400 leading-snug">
                      <ShieldCheck className="w-3.5 h-3.5 inline text-emerald-400 mr-1" />
                      Yönetici <strong>Enes Öztürk</strong> tüm yetkilere sahiptir. Kasiyer rolüyle silme denendiğinde Rust yetki hatası tetiklenir.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/80 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-orange-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
