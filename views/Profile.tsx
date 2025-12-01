
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Card, Button, SectionHeader } from '../components/Shared';
import { User, CreditCard, Shield, LogOut, ChevronRight, Phone, Lock, Save, ArrowLeft } from 'lucide-react';
import { View } from '../types';

interface ProfileProps {
    onNavigate?: (view: View) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { user, logout, updateBankDetails, changePassword, changeWithdrawalPassword } = useStore();
  
  // States
  const [activeSection, setActiveSection] = useState<'MAIN' | 'SECURITY'>('MAIN');
  const [isEditingBank, setIsEditingBank] = useState(false);
  
  // Bank Form State
  const [holderName, setHolderName] = useState(user?.bankDetails?.holderName || '');
  const [accountNumber, setAccountNumber] = useState(user?.bankDetails?.accountNumber || '');
  const [ifsc, setIfsc] = useState(user?.bankDetails?.ifsc || '');

  // Password Form State
  const [oldLoginPass, setOldLoginPass] = useState('');
  const [newLoginPass, setNewLoginPass] = useState('');
  
  const [oldWithdrawPass, setOldWithdrawPass] = useState('');
  const [newWithdrawPass, setNewWithdrawPass] = useState('');

  if (!user) return null;

  const handleSaveBank = () => {
    if (!holderName || !accountNumber || !ifsc) {
        alert("Please fill all fields");
        return;
    }
    updateBankDetails({ holderName, accountNumber, ifsc });
    setIsEditingBank(false);
    alert("Personal information updated successfully!");
  };

  const handleUpdateLoginPass = async () => {
      if(!oldLoginPass) { alert("Please enter old password"); return; }
      if(newLoginPass.length < 4) { alert("New password too short"); return; }
      try {
          await changePassword(oldLoginPass, newLoginPass);
          alert("Login password updated successfully");
          setOldLoginPass('');
          setNewLoginPass('');
      } catch (e) {
          alert((e as Error).message);
      }
  };

  const handleUpdateWithdrawPass = async () => {
      if(!oldWithdrawPass) { alert("Please enter old password"); return; }
      if(newWithdrawPass.length < 4) { alert("New password too short"); return; }
      try {
        await changeWithdrawalPassword(oldWithdrawPass, newWithdrawPass);
        alert("Withdrawal password updated successfully");
        setOldWithdrawPass('');
        setNewWithdrawPass('');
      } catch (e) {
        alert((e as Error).message);
      }
  };

  if (activeSection === 'SECURITY') {
      return (
          <div className="pb-24 animate-in slide-in-from-right">
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setActiveSection('MAIN')} className="p-2 bg-surfaceHighlight rounded-full hover:bg-white/10">
                    <ArrowLeft size={20} className="text-gray-300"/>
                </button>
                <h1 className="text-xl font-bold text-white">Security Center</h1>
            </div>

            <Card className="mb-4">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Lock size={16}/> Login Password</h3>
                <div className="space-y-3">
                    <input 
                        type="password" 
                        placeholder="Old Password" 
                        className="w-full bg-black/30 border border-white/10 rounded p-3 text-white text-sm focus:border-primary outline-none"
                        value={oldLoginPass}
                        onChange={e => setOldLoginPass(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="New Password" 
                        className="w-full bg-black/30 border border-white/10 rounded p-3 text-white text-sm focus:border-primary outline-none"
                        value={newLoginPass}
                        onChange={e => setNewLoginPass(e.target.value)}
                    />
                    <Button onClick={handleUpdateLoginPass} className="w-full py-2">Update Login Password</Button>
                </div>
            </Card>

            <Card>
                <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><CreditCard size={16}/> Withdrawal Password</h3>
                <div className="space-y-3">
                    <input 
                        type="password" 
                        placeholder="Old Password" 
                        className="w-full bg-black/30 border border-white/10 rounded p-3 text-white text-sm focus:border-primary outline-none"
                        value={oldWithdrawPass}
                        onChange={e => setOldWithdrawPass(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="New Password" 
                        className="w-full bg-black/30 border border-white/10 rounded p-3 text-white text-sm focus:border-primary outline-none"
                        value={newWithdrawPass}
                        onChange={e => setNewWithdrawPass(e.target.value)}
                    />
                    <Button onClick={handleUpdateWithdrawPass} className="w-full py-2">Update Withdrawal Password</Button>
                </div>
            </Card>
          </div>
      )
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Header */}
      <div className="flex items-center gap-4 py-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-blue-600 p-0.5">
          <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
            <User size={30} className="text-gray-300" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user.name}</h2>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-primary/20 text-primary font-bold border border-primary/20">
            {user.kycVerified ? 'KYC VERIFIED' : 'UNVERIFIED'}
          </span>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-3">
        <Card className="flex items-center gap-3 py-3">
            <Phone size={18} className="text-gray-400" />
            <span className="text-gray-300 text-sm flex-1">{user.phone}</span>
        </Card>
      </div>

      {/* Personal Information (Bank Details) */}
      <SectionHeader title="Personal Information" />
      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border border-white/5">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
                <CreditCard className="text-cyan-400" size={20} />
                <span className="text-sm font-bold text-gray-200">Withdrawal Account</span>
            </div>
            {!isEditingBank && (
                <button 
                    onClick={() => setIsEditingBank(true)} 
                    className="text-xs text-primary font-bold px-3 py-1 bg-primary/10 rounded-full hover:bg-primary/20"
                >
                    EDIT
                </button>
            )}
        </div>

        {isEditingBank ? (
            <div className="space-y-3 animate-in fade-in">
                <div>
                    <input 
                        className="w-full bg-black/30 border border-white/10 rounded p-2 text-sm text-white focus:border-primary outline-none"
                        placeholder="Holder Name"
                        value={holderName}
                        onChange={e => setHolderName(e.target.value)}
                    />
                </div>
                <div>
                    <input 
                        className="w-full bg-black/30 border border-white/10 rounded p-2 text-sm text-white focus:border-primary outline-none"
                        placeholder="Account Number"
                        value={accountNumber}
                        onChange={e => setAccountNumber(e.target.value)}
                    />
                </div>
                <div>
                    <input 
                        className="w-full bg-black/30 border border-white/10 rounded p-2 text-sm text-white focus:border-primary outline-none"
                        placeholder="IFSC Code"
                        value={ifsc}
                        onChange={e => setIfsc(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 mt-2">
                    <Button onClick={handleSaveBank} className="py-2 text-xs"><Save size={14}/> Save</Button>
                    <Button variant="secondary" onClick={() => setIsEditingBank(false)} className="py-2 text-xs">Cancel</Button>
                </div>
            </div>
        ) : (
            user.bankDetails ? (
            <>
                <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase">Account Holder</p>
                    <p className="text-white font-medium">{user.bankDetails.holderName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase">Account No.</p>
                        <p className="text-white font-medium tracking-wider">{user.bankDetails.accountNumber}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase">IFSC Code</p>
                        <p className="text-white font-medium">{user.bankDetails.ifsc}</p>
                    </div>
                </div>
            </>
            ) : (
            <div className="text-center py-4">
                <p className="text-sm text-gray-400">No bank account added.</p>
                <button onClick={() => setIsEditingBank(true)} className="text-xs text-primary font-bold mt-2">Add Now</button>
            </div>
            )
        )}
      </Card>

      {/* Menu Actions */}
      <div className="space-y-2 mt-4">
            <Card onClick={() => setActiveSection('SECURITY')} className="py-4 flex items-center justify-between group active:scale-[0.99] cursor-pointer">
                <div className="flex items-center gap-3">
                    <Shield size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="text-gray-200">Security Center</span>
                </div>
                <ChevronRight size={18} className="text-gray-600" />
            </Card>
      </div>

      <Button variant="danger" className="mt-8" onClick={logout}>
        <LogOut size={18} /> Log Out
      </Button>

      <div className="text-center text-xs text-gray-600 mt-8 pb-4">
        CAT Finance v1.3.1
      </div>
    </div>
  );
};
