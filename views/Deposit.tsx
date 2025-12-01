
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Card, Button, SectionHeader } from '../components/Shared';
import { Copy, CheckCircle, ArrowLeft, Banknote } from 'lucide-react';
import { View } from '../types';

interface DepositProps {
    onBack: () => void;
}

export const Deposit: React.FC<DepositProps> = ({ onBack }) => {
    const { deposit } = useStore();
    const [amount, setAmount] = useState('');
    const [utr, setUtr] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const COMPANY_UPI = "pay.catfinance@okhdfc";

    const copyUpi = () => {
        navigator.clipboard.writeText(COMPANY_UPI);
        alert("UPI ID Copied!");
    };

    const handleDeposit = async () => {
        const val = parseFloat(amount);
        if (!val || val < 500 || val > 50000) {
            alert("Deposit amount must be between ₹500 and ₹50000");
            return;
        }
        if (utr.length < 10) {
            alert("Please enter a valid 12-digit UTR number.");
            return;
        }
    
        setIsProcessing(true);
        await deposit(val, utr);
        setIsProcessing(false);
        alert("Deposit request submitted successfully. Waiting for Admin approval.");
        onBack();
    };

    return (
        <div className="pb-24 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack} className="p-2 bg-surfaceHighlight rounded-full hover:bg-white/10">
                    <ArrowLeft size={20} className="text-gray-300"/>
                </button>
                <h1 className="text-2xl font-bold text-white">Deposit Funds</h1>
            </div>

            <Card className="mb-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-cyan-500/30">
                <div className="text-center py-4">
                    <p className="text-sm text-cyan-200 uppercase font-bold tracking-widest mb-2">Pay via UPI</p>
                    <div className="bg-black/40 p-4 rounded-xl border border-dashed border-cyan-500/50 mb-4 inline-block">
                        <Banknote size={48} className="text-cyan-400 mx-auto opacity-80" />
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 bg-black/40 p-3 rounded-lg border border-white/10 max-w-xs mx-auto">
                        <code className="text-lg font-mono text-white select-all">{COMPANY_UPI}</code>
                        <button onClick={copyUpi} className="p-2 hover:text-cyan-400 transition-colors">
                            <Copy size={18} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                        Copy the UPI ID above and pay via Paytm, PhonePe, or GPay.
                    </p>
                </div>
            </Card>

            <SectionHeader title="Submit Details" />
            
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase">Amount (₹)</label>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white text-lg focus:outline-none focus:border-primary transition-colors"
                        placeholder="Min: 500, Max: 50000"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase">UTR / Reference Number</label>
                    <input 
                        type="text" 
                        value={utr}
                        onChange={(e) => setUtr(e.target.value)}
                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white text-lg focus:outline-none focus:border-primary transition-colors"
                        placeholder="Enter 12-digit UTR"
                    />
                    <p className="text-[10px] text-gray-500 mt-2 ml-1">
                        * Please verify the UTR correctly before submitting. Incorrect UTR will lead to rejection.
                    </p>
                </div>

                <Button onClick={handleDeposit} isLoading={isProcessing} className="mt-4">
                    <CheckCircle size={18} /> Submit Request
                </Button>
            </div>
        </div>
    );
};
