
import React from 'react';
import { useStore } from '../context/StoreContext';
import { Card, SectionHeader, Button } from '../components/Shared';
import { Copy, Share2, Award, Zap } from 'lucide-react';

export const Invite: React.FC = () => {
    const { user } = useStore();

    if (!user) return null;

    const copyToClipboard = () => {
        const origin = window.location.origin;
        const link = `${origin}?ref=${user.referralCode}`;
        navigator.clipboard.writeText(link);
        alert("Referral link copied!");
    };

    return (
        <div className="pb-24 animate-in fade-in duration-300">
            <SectionHeader title="Invite Friends" />
            
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-[0_0_30px_rgba(6,182,212,0.4)] mb-4">
                    <Award size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Earn Rewards</h2>
                <p className="text-gray-400 text-sm max-w-xs mx-auto">
                    Invite your friends to join CAT Finance and earn commission on their investments.
                </p>
            </div>

            <Card className="bg-surfaceHighlight border-primary/20 relative overflow-visible mb-6">
                <div className="absolute -top-3 left-4 bg-primary text-[#050b14] text-[10px] font-bold px-2 py-1 rounded">
                    MY CODE
                </div>
                <div className="flex flex-col items-center justify-center py-4">
                    <span className="text-3xl font-mono font-bold text-white tracking-wider mb-4">{user.referralCode}</span>
                    
                    <div className="w-full flex gap-3">
                         <Button onClick={copyToClipboard} variant="secondary" className="flex-1">
                            <Copy size={16} /> Copy Code
                         </Button>
                         <Button onClick={copyToClipboard} className="flex-1">
                            <Share2 size={16} /> Share Link
                         </Button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map(level => (
                    <Card key={level} className="text-center py-4 bg-[#1e293b]/50">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 text-primary">
                            <Zap size={16} fill="currentColor" />
                        </div>
                        <div className="text-xs text-gray-400 font-bold uppercase mb-1">Level {level}</div>
                        <div className="text-lg font-bold text-white">{level === 1 ? '10%' : level === 2 ? '5%' : '2%'}</div>
                    </Card>
                ))}
            </div>
            <p className="text-center text-[10px] text-gray-500 mt-4">
                * Commissions are credited to your wallet instantly after your referral's deposit is approved.
            </p>
        </div>
    );
};
