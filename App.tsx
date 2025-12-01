
import React, { useState } from 'react';
import { useStore, StoreProvider } from './context/StoreContext';
import { Home } from './views/Home';
import { Team } from './views/Team';
import { History } from './views/History';
import { Profile } from './views/Profile';
import { Auth } from './views/Auth';
import { AdminPanel } from './views/AdminPanel';
import { Deposit } from './views/Deposit';
import { Withdraw } from './views/Withdraw';
import { Invite } from './views/Invite';
import { View } from './types';
import { Home as HomeIcon, Users, Clock, User, PlusCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useStore();
  const [currentView, setCurrentView] = useState<View>(View.HOME);

  // Auth Guard
  if (!isAuthenticated) {
    return <Auth />;
  }

  // --- ADMIN LAYOUT ---
  if (user?.isAdmin) {
      return (
          <div className="min-h-screen bg-background text-gray-100 font-sans selection:bg-primary/30">
            <div className="max-w-md mx-auto min-h-screen relative bg-[#050b14] shadow-2xl overflow-hidden flex flex-col">
                <AdminPanel />
            </div>
          </div>
      );
  }

  // --- USER LAYOUT ---

  const renderView = () => {
    switch (currentView) {
      case View.HOME: return <Home onNavigate={setCurrentView} />;
      case View.TEAM: return <Team />;
      case View.HISTORY: return <History />;
      case View.PROFILE: return <Profile onNavigate={setCurrentView} />;
      case View.DEPOSIT: return <Deposit onBack={() => setCurrentView(View.HOME)} />;
      case View.WITHDRAW: return <Withdraw onBack={() => setCurrentView(View.HOME)} />;
      case View.INVITE: return <Invite />;
      default: return <Home onNavigate={setCurrentView} />;
    }
  };

  const NavButton: React.FC<{ view: View; icon: React.ElementType; label: string }> = ({ view, icon: Icon, label }) => {
    const isActive = currentView === view;
    return (
      <button 
        onClick={() => setCurrentView(view)}
        className={`flex flex-col items-center justify-center w-full py-2 transition-all duration-300 ${isActive ? 'text-primary transform -translate-y-1' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <div className={`p-1.5 rounded-xl mb-1 transition-all ${isActive ? 'bg-primary/10 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : ''}`}>
           <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background text-gray-100 font-sans selection:bg-primary/30">
      {/* Mobile-centric Layout Container */}
      <div className="max-w-md mx-auto min-h-screen relative bg-[#050b14] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top App Bar - Hide on Deposit/Withdraw for cleaner look */}
        {currentView !== View.DEPOSIT && currentView !== View.WITHDRAW && (
          <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 z-30 bg-[#050b14]/80 backdrop-blur-md border-b border-white/5">
              <div onClick={() => setCurrentView(View.HOME)} className="cursor-pointer">
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tighter">
                  CAT
                </h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Capital Asset Tracker</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-surfaceHighlight border border-white/10 flex items-center justify-center">
                 <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
          </header>
        )}

        {/* Scrollable Content Area */}
        <main className={`flex-1 overflow-y-auto px-5 py-6 scroll-smooth ${currentView === View.DEPOSIT || currentView === View.WITHDRAW ? 'pt-12' : ''}`}>
          {renderView()}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-[#0f172a]/90 backdrop-blur-xl border-t border-white/5 pb-safe pt-2">
          <div className="flex justify-between items-end px-2 pb-2">
            <NavButton view={View.HOME} icon={HomeIcon} label="Home" />
            <NavButton view={View.TEAM} icon={Users} label="Team" />
            
            {/* Center Invite Button */}
            <div className="relative -top-5">
                <button 
                    onClick={() => setCurrentView(View.INVITE)}
                    className={`w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/40 border-4 border-[#050b14] active:scale-95 transition-transform ${currentView === View.INVITE ? 'scale-110 shadow-cyan-500/60' : ''}`}
                >
                    <PlusCircle size={28} />
                </button>
                <span className={`absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] font-bold ${currentView === View.INVITE ? 'text-cyan-400' : 'text-gray-400'}`}>INVITE</span>
            </div>

            <NavButton view={View.HISTORY} icon={Clock} label="History" />
            <NavButton view={View.PROFILE} icon={User} label="Me" />
          </div>
        </nav>
        
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
