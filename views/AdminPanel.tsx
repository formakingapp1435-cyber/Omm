
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Card, SectionHeader, Button } from '../components/Shared';
import { ArrowDownLeft, ArrowUpRight, Check, X, Users, DollarSign, Edit, LogOut, BarChart3, Database } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
      pendingTransactions, 
      adminApproveTransaction, 
      adminRejectTransaction, 
      allUsers, 
      adminUpdateBalance,
      calculateTeamStats,
      logout
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'TRANSACTIONS' | 'USERS'>('DASHBOARD');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState<string>('');

  const handleEditBalance = (user: any) => {
      setEditingUserId(user.id);
      setNewBalance(user.balance.toString());
  };

  const saveBalance = () => {
      if (editingUserId) {
          const bal = parseFloat(newBalance);
          if (!isNaN(bal)) {
              adminUpdateBalance(editingUserId, bal);
              setEditingUserId(null);
          }
      }
  };
  
  // Stats Calculation
  const totalUsers = allUsers.filter(u => !u.isAdmin).length;
  const totalBalance = allUsers.reduce((acc, u) => acc + u.balance, 0);
  
  // Note: For total deposits/withdrawals we would ideally iterate global transactions, but we can also sum user stats roughly
  // For now let's use the allUsers loop to get a "snapshot"
  

  return (
    <div className="pb-24 pt-10 px-5 h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-black text-white">ADMIN</h1>
            <p className="text-xs text-red-500 font-bold tracking-widest uppercase">Command Center</p>
        </div>
        <Button variant="danger" onClick={logout} className="w-auto py-2 px-4 text-xs">
            <LogOut size={16} /> Logout
        </Button>
      </div>

      <div className="flex p-1 bg-surfaceHighlight rounded-xl mb-6 border border-white/5">
        <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'DASHBOARD' ? 'bg-primary text-[#050b14]' : 'text-gray-400'}`}
        >
            <BarChart3 size={16} className="mx-auto mb-1"/> Stats
        </button>
        <button
            onClick={() => setActiveTab('TRANSACTIONS')}
            className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'TRANSACTIONS' ? 'bg-primary text-[#050b14]' : 'text-gray-400'}`}
        >
            <ArrowDownLeft size={16} className="mx-auto mb-1"/> Trans
        </button>
        <button
            onClick={() => setActiveTab('USERS')}
            className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'USERS' ? 'bg-primary text-[#050b14]' : 'text-gray-400'}`}
        >
            <Database size={16} className="mx-auto mb-1"/> Users
        </button>
      </div>

      {activeTab === 'DASHBOARD' && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in">
              <Card className="bg-blue-900/10 border-blue-500/20 text-center py-6">
                  <div className="text-3xl font-black text-white">{totalUsers}</div>
                  <div className="text-[10px] text-blue-300 uppercase font-bold tracking-wider">Total Users</div>
              </Card>
              <Card className="bg-emerald-900/10 border-emerald-500/20 text-center py-6">
                  <div className="text-3xl font-black text-white">₹{totalBalance.toLocaleString()}</div>
                  <div className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider">User Holdings</div>
              </Card>
              <Card className="col-span-2 bg-purple-900/10 border-purple-500/20 p-4">
                  <h3 className="font-bold text-white mb-2 text-sm uppercase">Pending Actions</h3>
                  <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Deposits & Withdrawals</span>
                      <span className="text-xl font-bold text-purple-400">{pendingTransactions.length}</span>
                  </div>
              </Card>
          </div>
      )}

      {activeTab === 'TRANSACTIONS' && (
          <div className="space-y-4 animate-in slide-in-from-right">
            <SectionHeader title="Pending Approvals" />
            {pendingTransactions.length === 0 ? (
                <div className="text-center py-12 bg-surfaceHighlight rounded-2xl border border-white/5">
                    <Check size={32} className="mx-auto mb-3 text-emerald-500/50"/>
                    <p className="text-gray-500 text-sm">All caught up!</p>
                </div>
            ) : (
                pendingTransactions.map(tx => (
                <Card key={tx.id} className="relative">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <span className={`p-1.5 rounded-lg ${tx.type === 'Deposit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                {tx.type === 'Deposit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                            </span>
                            <div>
                                <h4 className="font-bold text-white text-sm">{tx.type} Request</h4>
                                <p className="text-xs text-gray-400">{tx.date}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-white text-lg">₹{tx.amount}</div>
                        </div>
                    </div>

                    <div className="bg-black/20 p-3 rounded-lg text-xs space-y-1 mb-4 border border-white/5">
                        <div className="flex justify-between">
                            <span className="text-gray-500">User Name:</span>
                            <span className="text-gray-300 font-bold">{tx.userName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">User ID:</span>
                            <span className="text-gray-300 font-mono text-[10px]">{tx.userId}</span>
                        </div>
                        {tx.utr && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">UTR:</span>
                                <span className="text-yellow-400 font-mono select-all font-bold">{tx.utr}</span>
                            </div>
                        )}
                         {tx.type === 'Withdraw' && (
                            <div className="pt-2 mt-2 border-t border-white/5">
                                <span className="text-gray-500 block mb-1">Action:</span>
                                <span className="text-emerald-400 font-bold">Approve = SUCCESS</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button 
                            variant="danger" 
                            className="py-2 text-xs" 
                            onClick={() => adminRejectTransaction(tx.id)}
                        >
                            <X size={14} /> Reject
                        </Button>
                        <Button 
                            className="py-2 text-xs bg-emerald-600 hover:bg-emerald-700 border-emerald-500" 
                            onClick={() => adminApproveTransaction(tx.id)}
                        >
                            <Check size={14} /> Approve
                        </Button>
                    </div>
                </Card>
                ))
            )}
          </div>
      )}

      {activeTab === 'USERS' && (
          <div className="space-y-4 animate-in slide-in-from-right">
             <SectionHeader title="User Management" />
             {allUsers.filter(u => !u.isAdmin).length === 0 ? (
                 <div className="text-center py-10 text-gray-500">No registered users yet.</div>
             ) : (
                 allUsers.filter(u => !u.isAdmin).map(user => {
                     const teamStats = calculateTeamStats(user.id);
                     return (
                     <Card key={user.id} className="flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-surfaceHighlight flex items-center justify-center text-gray-400">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{user.name}</h4>
                                    <p className="text-xs text-gray-500">{user.phone}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-gray-500 uppercase font-bold">Balance</div>
                                <div className="text-lg font-mono font-bold text-primary">₹{user.balance}</div>
                            </div>
                        </div>

                        {editingUserId === user.id ? (
                            <div className="flex items-center gap-2 mt-2 bg-black/20 p-2 rounded-lg border border-primary/50">
                                <DollarSign size={16} className="text-gray-500"/>
                                <input 
                                    type="number" 
                                    value={newBalance}
                                    onChange={e => setNewBalance(e.target.value)}
                                    className="flex-1 bg-transparent text-white text-sm outline-none"
                                    placeholder="Enter new balance"
                                    autoFocus
                                />
                                <button onClick={saveBalance} className="text-emerald-400 font-bold text-xs px-2 hover:text-emerald-300">SAVE</button>
                                <button onClick={() => setEditingUserId(null)} className="text-red-400 font-bold text-xs px-2 hover:text-red-300">CANCEL</button>
                            </div>
                        ) : (
                            <Button variant="secondary" className="py-2 text-xs mt-2" onClick={() => handleEditBalance(user)}>
                                <Edit size={14} /> Edit Balance
                            </Button>
                        )}
                        
                        {/* Team Stats Section */}
                        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5">
                            <div className="bg-black/20 p-2 rounded">
                                <div className="text-[10px] text-gray-500">Team Recharge</div>
                                <div className="text-sm font-bold text-emerald-400">₹{teamStats.totalRecharge}</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded">
                                <div className="text-[10px] text-gray-500">Team Size</div>
                                <div className="text-sm font-bold text-white">{teamStats.teamSize}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 border-t border-white/5 pt-2 mt-1 bg-black/10 p-2 rounded">
                            <div>Password: <span className="text-gray-300 select-all">{user.password}</span></div>
                            <div>W-Pass: <span className="text-gray-300 select-all">{user.withdrawalPassword}</span></div>
                            <div className="col-span-2">Referral Code: <span className="text-gray-300 select-all">{user.referralCode}</span></div>
                        </div>
                     </Card>
                 )})
             )}
          </div>
      )}
    </div>
  );
};
