
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Card, Button, SectionHeader } from '../components/Shared';
import { CreditCard, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { View } from '../types';

interface WithdrawProps {
    onBack: () => void;
}

export const Withdraw: React.FC<WithdrawProps> = ({ onBack }) => {
    const { user, withdraw } = useStore();
    const [amount, setAmount] = useState('');
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!user) return null;

    const handleWithdraw = async () => {
        const val = parseFloat(amount);
        if (!val || val < 150) {
            alert("Minimum withdrawal is ₹150");
            return;
        }
        
        setIsProcessing(true);
        try {
          await withdraw(val, password);
          alert("Withdrawal request submitted successfully!");
          onBack();
        } catch (e) {
          alert((e as Error).message);
        } finally {
          setIsProcessing(false);
        }
    };

    return (
        <div className="pb-24 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack} className="p-2 bg-surfaceHighlight rounded-full hover:bg-white/10">
                    <ArrowLeft size={20} className="text-gray-300"/>
                </button>
                <h1 className="text-2xl font-bold text-white">Withdraw Funds</h1>
            </div>

            <Card className="mb-6 bg-gradient-to-r from-slate-800 to-slate-900 border border-white/5">
                <div className="flex items-center gap-3 mb-4 text-gray-400 text-sm">
                    <CreditCard size={18} className="text-primary"/>
                    <span>Receiving Bank Account</span>
                </div>
                {user.bankDetails ? (
                    <div className="space-y-1">
                         <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-white tracking-widest">
                                {user.bankDetails.accountNumber.replace(/.(?=.{4})/g, '•')}
                            </span>
                         </div>
                         <div className="flex justify-between text-xs text-gray-500 mt-2">
                             <span>{user.bankDetails.holderName}</span>
                             <span>{user.bankDetails.ifsc}</span>
                         </div>
                    </div>
                ) : (
                    <div className="text-center py-2 text-rose-400 text-sm font-medium">
                        No bank account linked. Please add in Profile.
                    </div>
                )}
            </Card>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between mb-2">
                         <label className="block text-xs font-medium text-gray-500 uppercase">Amount (₹)</label>
                         <span className="text-xs text-primary font-bold">Balance: ₹{user.balance}</span>
                    </div>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white text-lg focus:outline-none focus:border-primary transition-colors"
                        placeholder="Min: 150"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase">Withdrawal Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-500" />
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-11 bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="Enter password"
                        />
                    </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex gap-3 items-start">
                    <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-200/80 leading-relaxed">
                        Withdrawal Time: 6:00 AM - 6:00 PM<br/>
                        Minimum Withdrawal: ₹150<br/>
                        Tax: 10%
                    </p>
                </div>

                <Button 
                    onClick={handleWithdraw} 
                    isLoading={isProcessing} 
                    className="mt-2 bg-rose-500 hover:bg-rose-600 border-rose-500 shadow-rose-500/20"
                    disabled={!user.bankDetails}
                >
                     Withdraw Now
                </Button>
            </div>
        </div>
    );
};
