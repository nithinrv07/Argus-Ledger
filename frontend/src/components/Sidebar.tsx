import React from 'react';
import {
  LayoutGrid,
  ScrollText,
  ScanEye,
  BarChart3,
  ShieldCheck,
  Bell,
  Settings,
  HelpCircle,
  Zap,
} from 'lucide-react';

export type TabType = 'overview' | 'studio' | 'ledger' | 'inspector' | 'analytics';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  unverifiedCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navItems = [
    {
      id: 'overview' as TabType,
      label: 'Dashboard Overview',
      icon: LayoutGrid,
    },
    {
      id: 'studio' as TabType,
      label: 'Live Decision Studio (Enter Data & Evaluate)',
      icon: Zap,
    },
    {
      id: 'ledger' as TabType,
      label: 'Audit Ledger Explorer',
      icon: ScrollText,
    },
    {
      id: 'inspector' as TabType,
      label: 'Decision Inspector',
      icon: ScanEye,
    },
    {
      id: 'analytics' as TabType,
      label: 'Compliance Analytics',
      icon: BarChart3,
    },
  ];

  return (
    <aside
      id="aegis-sidebar"
      className="fixed left-0 top-0 bottom-0 w-20 md:w-24 bg-[#265e53] flex flex-col items-center py-6 z-30 transition-all duration-300 shadow-xl select-none"
    >
      {/* Brand Logo - Styled geometric mark referencing the screenshot */}
      <div className="mb-8 flex flex-col items-center">
        <button
          onClick={() => setActiveTab('overview')}
          id="sidebar-logo-btn"
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f5b842] to-[#e69828] flex items-center justify-center shadow-md shadow-emerald-950/20 hover:scale-105 transition-transform"
          title="Aegis Ledger"
        >
          <ShieldCheck className="w-7 h-7 text-white drop-shadow-sm" />
        </button>
        <span className="text-[10px] font-bold text-emerald-100/70 tracking-widest uppercase mt-2">
          AEGIS
        </span>
      </div>

      {/* Primary Navigation Stack */}
      <nav className="flex-1 flex flex-col items-center gap-3 w-full px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`relative group w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-white text-[#265e53] shadow-lg shadow-black/10 scale-100'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon
                className={`w-6 h-6 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'stroke-[2.5px]' : 'stroke-2'
                }`}
              />

              {/* Active Indicator Pip */}
              {isActive && (
                <span className="absolute -left-1 w-1.5 h-6 bg-[#f5b842] rounded-r-full shadow-sm" />
              )}

              {/* Tooltip on Desktop */}
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900/90 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg backdrop-blur-sm">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Utility Icons */}
      <div className="flex flex-col items-center gap-3 w-full px-3 pt-4 border-t border-emerald-700/50">
        <button
          onClick={() => setActiveTab('analytics')}
          id="sidebar-notifications-btn"
          title="System Alerts"
          className="relative w-11 h-11 rounded-xl text-emerald-100/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f5b842] ring-2 ring-[#265e53]" />
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          id="sidebar-settings-btn"
          title="Ledger Settings"
          className="w-11 h-11 rounded-xl text-emerald-100/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>

        <button
          onClick={() => alert('Aegis Ledger v4.2 - Cryptographically anchored autonomous decision audit platform.')}
          id="sidebar-help-btn"
          title="System Documentation & Standards (ISO-42001)"
          className="w-11 h-11 rounded-xl text-emerald-100/50 hover:text-emerald-100 flex items-center justify-center transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
