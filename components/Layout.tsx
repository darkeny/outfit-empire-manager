
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Resumo', icon: 'fa-chart-pie' },
    { id: 'new-order', label: 'Novo', icon: 'fa-plus-circle' },
    { id: 'orders', label: 'Pedidos', icon: 'fa-list-ul' },
    { id: 'settings', label: 'Ajustes', icon: 'fa-gear' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F2F2F7] text-[#1C1C1E]">
      {/* Desktop Sidebar - macOS Style */}
      <aside className="hidden md:flex flex-col w-72 bg-[#F8F8FA] border-r border-[#D1D1D6] h-screen sticky top-0">
        <div className="p-10 pb-6">
          <h1 className="text-2xl font-[900] text-[#1C1C1E] tracking-tight italic">OUTFIT<br/>EMPIRE</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                ? 'bg-violet-600 text-white shadow-md' 
                : 'text-[#8E8E93] hover:bg-[#E5E5EA]'
              }`}
            >
              <i className={`fas ${item.icon} text-lg`}></i>
              <span className="font-semibold text-[15px]">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-6">
          <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-[#D1D1D6] shadow-sm">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs">
              GB
            </div>
            <div>
              <p className="text-xs font-bold leading-none">Auneta Machava</p>
              <p className="text-[10px] text-[#8E8E93] mt-1 font-medium">Administradora</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar - iOS Style */}
      <header className="md:hidden bg-white/70 backdrop-blur-2xl border-b border-[#D1D1D6] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-lg font-black tracking-tight italic">OUTFIT EMPIRE</h1>
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <i className="fas fa-user-circle"></i>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-5 md:p-10 overflow-y-auto pb-32 md:pb-12">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar - iOS Style */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-[#D1D1D6] flex justify-around items-center pt-2 pb-8 px-4 z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-full transition-all ${
              activeTab === item.id ? 'text-violet-600' : 'text-[#8E8E93]'
            }`}
          >
            <i className={`fas ${item.icon} text-xl mb-1`}></i>
            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
