import React from 'react';
import { useStore } from '../context/StoreContext';
import { Card, SectionHeader, StatusBadge } from '../components/Shared';
import { ArrowDownLeft, ArrowUpRight, Briefcase, Users } from 'lucide-react';

export const History: React.FC = () => {
  const { transactions } = useStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'Deposit': return <ArrowDownLeft size={20} className="text-emerald-400" />;
      case 'Withdraw': return <ArrowUpRight size={20} className="text-rose-400" />;
      case 'Investment': return <Briefcase size={20} className="text-blue-400" />;
      default: return <Users size={20} className="text-violet-400" />;
    }
  };

  return (
    <div className="pb-24">
      <SectionHeader title="Recent Transactions" />
      <div className="space-y-3">
        {transactions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No transactions found.</div>
        ) : (
            transactions.map(tx => (
            <Card key={tx.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surfaceHighlight flex items-center justify-center border border-white/5">
                    {getIcon(tx.type)}
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm">{tx.description || tx.type}</h4>
                    <p className="text-xs text-gray-500">
                    {new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                <span className={`font-bold ${tx.type === 'Withdraw' || tx.type === 'Investment' ? 'text-white' : 'text-emerald-400'}`}>
                    {tx.type === 'Withdraw' || tx.type === 'Investment' ? '-' : '+'}₹{tx.amount}
                </span>
                <StatusBadge status={tx.status} />
                </div>
            </Card>
            ))
        )}
      </div>
    </div>
  );
};