
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Card, Button, SectionHeader } from '../components/Shared';
import { ArrowUpRight, ArrowDownLeft, ShieldCheck, Headphones, Send, Lock } from 'lucide-react';
import { InvestmentPlan, View } from '../types';

interface HomeProps {
  onNavigate: (view: View) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { user, availablePlans, activePlans, invest } = useStore();
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) return null;

  const handleInvest = async () => {
    if (!selectedPlan) return;
    setIsProcessing(true);
    try {
      await invest(selectedPlan);
      setSelectedPlan(null); // Close modal
      alert(`Successfully invested in ${selectedPlan.name}!`);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Wallet Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full transform -translate-y-1/2"></div>
        <Card className="border-0 bg-gradient-to-br from-[#1e293b] to-[#0f172a] shadow-2xl relative z-10 overflow-visible">
          <div className="flex flex-col items-center py-4">
            <span className="text-slate-400 text-sm font-medium mb-1">Total Balance</span>
            <h1 className="text-4xl font-black text-white mb-6 tracking-tight">
              ₹{user.balance.toLocaleString()}
            </h1>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button onClick={() => onNavigate(View.DEPOSIT)} className="bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500/30 text-emerald-400">
                <ArrowDownLeft size={18} /> Deposit
              </Button>
              <Button onClick={() => onNavigate(View.WITHDRAW)} className="bg-rose-500/20 border border-rose-500/50 hover:bg-rose-500/30 text-rose-400">
                <ArrowUpRight size={18} /> Withdraw
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Service & Channel Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Card 
          onClick={() => window.open('https://t.me/OmmPrakash0123', '_blank')} 
          className="p-4 flex flex-col items-center justify-center bg-[#1e293b]/80 border-white/5 active:scale-95 transition-transform group"
        >
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform">
            <Headphones size={24} />
          </div>
          <span className="text-sm font-bold text-gray-200">Customer Service</span>
        </Card>

        <Card 
          onClick={() => window.open('https://t.me/catinvestmentappforu', '_blank')} 
          className="p-4 flex flex-col items-center justify-center bg-[#1e293b]/80 border-white/5 active:scale-95 transition-transform group"
        >
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-2 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:scale-110 transition-transform">
            <Send size={24} />
          </div>
          <span className="text-sm font-bold text-gray-200">Official Channel</span>
        </Card>
      </div>

      {/* Investment Plans */}
      <SectionHeader title="Available Plans" />
      <div className="grid gap-6">
        {availablePlans.map(plan => {
          const isActive = plan.status === 'Active';
          return (
            <div key={plan.id} className={`group relative bg-[#1e293b]/80 border ${isActive ? 'border-white/10 hover:border-primary/50' : 'border-white/5 opacity-70'} rounded-2xl overflow-hidden transition-all`}>
              
              {!isActive && (
                 <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="bg-black/80 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                        <Lock size={16} className="text-gray-400"/>
                        <span className="font-bold text-gray-200">COMING SOON</span>
                    </div>
                 </div>
              )}

              {/* Plan Image */}
              <div className="h-36 w-full relative overflow-hidden">
                {plan.imageUrl ? (
                  <img 
                    src={plan.imageUrl} 
                    alt={plan.name} 
                    className={`w-full h-full object-cover transition-transform duration-500 ${isActive ? 'group-hover:scale-110' : 'grayscale'}`}
                  />
                ) : (
                  <div className="w-full h-full bg-surfaceHighlight flex items-center justify-center text-gray-600">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent"></div>
                
                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 leading-none text-shadow">{plan.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold">
                          {plan.durationDays} Days Cycle
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">{plan.description}</p>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 rounded-lg bg-black/20 border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Invest</div>
                    <div className="font-bold text-white text-sm">₹{plan.amount}</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-black/20 border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Daily</div>
                    <div className="font-bold text-success text-sm">₹{plan.dailyReturn}</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-black/20 border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Total</div>
                    <div className="font-bold text-primary text-sm">₹{plan.totalReturn}</div>
                  </div>
                </div>

                <Button 
                  onClick={() => setSelectedPlan(plan)} 
                  className="w-full py-3 text-sm"
                  disabled={!isActive}
                  variant={isActive ? 'primary' : 'secondary'}
                >
                  {isActive ? 'Invest Now' : 'Locked'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Plans */}
      {activePlans.length > 0 && (
        <>
          <SectionHeader title="Your Investments" />
          <div className="space-y-3">
            {activePlans.map(plan => (
              <Card key={plan.id} className="flex justify-between items-center py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                     <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{plan.name}</h4>
                    <p className="text-xs text-gray-400">Ends: {new Date(plan.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary">Active</div>
                  <div className="text-xs text-gray-400">₹{plan.dailyReturn}/day</div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Investment Confirmation Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#1e293b] border border-white/10 rounded-2xl p-6 shadow-2xl transform transition-all scale-100">
              <h2 className="text-2xl font-bold text-white mb-2">Confirm Investment</h2>
              <p className="text-gray-400 mb-6">
                You are investing <span className="text-white font-bold">₹{selectedPlan.amount}</span> in the <span className="text-primary">{selectedPlan.name}</span> plan.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">Wallet Balance</span>
                  <span className="text-white">₹{user.balance}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">Cost</span>
                  <span className="text-rose-400">-₹{selectedPlan.amount}</span>
                </div>
                <div className="flex justify-between py-2 font-bold">
                  <span className="text-gray-200">Remaining</span>
                  <span className={user.balance - selectedPlan.amount < 0 ? "text-red-500" : "text-white"}>
                    ₹{user.balance - selectedPlan.amount}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" onClick={() => setSelectedPlan(null)}>Cancel</Button>
                <Button onClick={handleInvest} isLoading={isProcessing} disabled={user.balance < selectedPlan.amount}>
                  {user.balance < selectedPlan.amount ? 'Insufficient Funds' : 'Confirm'}
                </Button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};
