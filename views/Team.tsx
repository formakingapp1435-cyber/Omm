
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Card, SectionHeader } from '../components/Shared';
import { Calendar, User } from 'lucide-react';

export const Team: React.FC = () => {
  const { user, teamMembers } = useStore();
  const [activeLevel, setActiveLevel] = useState<number>(1);

  if (!user) return null;

  const filteredMembers = teamMembers.filter(member => member.level === activeLevel);

  return (
    <div className="space-y-6 pb-24">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border-violet-500/20 text-center py-6">
          <div className="text-3xl font-black text-white mb-1">{user.teamCount}</div>
          <div className="text-xs font-bold text-violet-300 uppercase tracking-wider">Total Team</div>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border-emerald-500/20 text-center py-6">
          <div className="text-3xl font-black text-white mb-1">₹{user.referralEarnings}</div>
          <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Ref. Income</div>
        </Card>
      </div>

      <SectionHeader title="Team Members" />

      {/* Level Tabs */}
      <div className="flex p-1 bg-surfaceHighlight rounded-xl mb-4 border border-white/5">
        {[1, 2, 3].map(level => (
            <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    activeLevel === level 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
                <User size={14} className={activeLevel === level ? 'text-white' : 'text-gray-500'} />
                Level {level}
            </button>
        ))}
      </div>

      {/* Team Details Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#1e293b]/50 min-h-[300px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-surfaceHighlight text-[10px] uppercase text-gray-300 font-bold tracking-wider">
                    <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Joined</th>
                        <th className="px-4 py-3 text-right">Dep/With</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map(member => (
                            <tr key={member.id} className="hover:bg-white/5 transition-colors animate-in fade-in duration-200">
                                <td className="px-4 py-3">
                                    <div className="font-medium text-white">{member.name}</div>
                                    <div className="text-xs text-gray-500">{member.phone}</div>
                                </td>
                                <td className="px-4 py-3 text-xs">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(member.joinDate).toLocaleDateString()}
                                    </div>
                                    <div className="text-[10px] opacity-70">
                                         {new Date(member.joinDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="text-emerald-400 font-bold text-xs">+₹{member.totalDeposit}</div>
                                    <div className="text-rose-400 text-xs">-₹{member.totalWithdraw}</div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="px-4 py-12 text-center">
                                <div className="flex flex-col items-center justify-center text-gray-600">
                                    <User size={32} className="mb-2 opacity-50"/>
                                    <p className="text-sm">No members in Level {activeLevel}</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};
