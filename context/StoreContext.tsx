
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, InvestmentPlan, Transaction, User, UserPlan, TeamMember } from '../types';

// Updated Plans
const INITIAL_PLANS: InvestmentPlan[] = [
  {
    id: 'plan_1',
    name: 'Plan A (Starter)',
    amount: 750,
    dailyReturn: 100,
    durationDays: 365,
    totalReturn: 36500,
    description: 'Entry level computational power share.',
    imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&auto=format&fit=crop&q=60',
    status: 'Active'
  },
  {
    id: 'plan_2',
    name: 'Plan B (Growth)',
    amount: 2000,
    dailyReturn: 300,
    durationDays: 365,
    totalReturn: 109500,
    description: 'Short term high-yield algorithmic trading.',
    imageUrl: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=800&auto=format&fit=crop&q=60',
    status: 'Coming Soon'
  },
  {
    id: 'plan_3',
    name: 'Plan C (Pro)',
    amount: 5000,
    dailyReturn: 800,
    durationDays: 365,
    totalReturn: 292000,
    description: 'Leveraged crypto-asset staking pool.',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60',
    status: 'Coming Soon'
  },
  {
    id: 'plan_4',
    name: 'Plan D (Elite)',
    amount: 10000,
    dailyReturn: 1800,
    durationDays: 365,
    totalReturn: 657000,
    description: 'Institutional grade infrastructure access.',
    imageUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fdd720e?w=800&auto=format&fit=crop&q=60',
    status: 'Coming Soon'
  }
];

// Updated Admin User
const ADMIN_USER: User = {
  id: 'admin_000',
  name: 'Super Admin',
  phone: '0000000000',
  password: 'admin',
  withdrawalPassword: 'admin',
  balance: 0,
  referralCode: 'ADMIN',
  referralEarnings: 0,
  teamCount: 0,
  kycVerified: true,
  isAdmin: true
};

interface StoreContextType extends AppState {
  isAuthenticated: boolean;
  allUsers: User[]; 
  login: (phone: string, pass: string) => Promise<void>;
  register: (name: string, phone: string, pass: string, refCode?: string) => Promise<void>;
  logout: () => void;
  deposit: (amount: number, utr: string) => Promise<void>;
  withdraw: (amount: number, password?: string) => Promise<void>;
  invest: (plan: InvestmentPlan) => Promise<void>;
  updateBankDetails: (details: User['bankDetails']) => void;
  adminApproveTransaction: (txId: string) => void;
  adminRejectTransaction: (txId: string) => void;
  adminUpdateBalance: (userId: string, newBalance: number) => void;
  changePassword: (oldPass: string, newPass: string) => Promise<void>;
  changeWithdrawalPassword: (oldPass: string, newPass: string) => Promise<void>;
  calculateTeamStats: (userId: string) => { totalRecharge: number, totalWithdraw: number, teamSize: number };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- Persistent State Initialization ---
  
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('cat_users');
    return saved ? JSON.parse(saved) : [ADMIN_USER];
  });

  const [globalTransactions, setGlobalTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('cat_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [globalPlans, setGlobalPlans] = useState<UserPlan[]>(() => {
      const saved = localStorage.getItem('cat_plans');
      return saved ? JSON.parse(saved) : [];
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
      const savedId = localStorage.getItem('cat_session_id');
      if (savedId) {
          const users = localStorage.getItem('cat_users');
          if(users) {
              const parsedUsers = JSON.parse(users) as User[];
              return parsedUsers.find(u => u.id === savedId) || null;
          }
      }
      return null;
  });

  // --- Persistence Effects ---

  useEffect(() => {
    localStorage.setItem('cat_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('cat_transactions', JSON.stringify(globalTransactions));
  }, [globalTransactions]);

  useEffect(() => {
      localStorage.setItem('cat_plans', JSON.stringify(globalPlans));
  }, [globalPlans]);

  useEffect(() => {
      if (currentUser) {
          localStorage.setItem('cat_session_id', currentUser.id);
      } else {
          localStorage.removeItem('cat_session_id');
      }
  }, [currentUser]);


  // --- Auth Actions ---

  const login = async (phone: string, pass: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = allUsers.find(u => u.phone === phone && u.password === pass);
        if (foundUser) {
          setCurrentUser(foundUser);
          resolve();
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 500);
    });
  };

  const register = async (name: string, phone: string, pass: string, refCode?: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (!name || phone.length < 10 || pass.length < 4) {
          reject(new Error("Please fill all fields correctly"));
          return;
        }

        if (allUsers.find(u => u.phone === phone)) {
            reject(new Error("Phone number already registered"));
            return;
        }

        const newUser: User = {
          id: 'u_' + Date.now(),
          name: name,
          phone: phone,
          password: pass,
          withdrawalPassword: pass, 
          balance: 0,
          referralCode: 'CAT-' + Math.floor(1000 + Math.random() * 9000),
          referralEarnings: 0,
          teamCount: 0,
          kycVerified: false,
          bankDetails: undefined,
          referredBy: refCode,
          isAdmin: false
        };

        setAllUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // --- User Actions ---

  const updateBankDetails = (details: User['bankDetails']) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, bankDetails: details };
      setCurrentUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    return new Promise<void>((resolve, reject) => {
        if(!currentUser) return;
        setTimeout(() => {
             if (currentUser.password === oldPass) {
                const updatedUser = { ...currentUser, password: newPass };
                setCurrentUser(updatedUser);
                setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
                resolve();
            } else {
                reject(new Error("Incorrect old password"));
            }
        }, 500);
    });
  };

  const changeWithdrawalPassword = async (oldPass: string, newPass: string) => {
     return new Promise<void>((resolve, reject) => {
        if(!currentUser) return;
        setTimeout(() => {
            if (currentUser.withdrawalPassword === oldPass) {
                const updatedUser = { ...currentUser, withdrawalPassword: newPass };
                setCurrentUser(updatedUser);
                setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
                resolve();
            } else {
                reject(new Error("Incorrect old withdrawal password"));
            }
        }, 500);
    });
  };

  const deposit = async (amount: number, utr: string) => {
    if (!currentUser) return;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newTx: Transaction = {
          id: `tx_${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          type: 'Deposit',
          amount,
          date: new Date().toISOString(),
          status: 'Pending', 
          utr: utr,
          description: `Deposit via UTR: ${utr}`
        };
        setGlobalTransactions(prev => [newTx, ...prev]);
        resolve();
      }, 500);
    });
  };

  const withdraw = async (amount: number, password?: string) => {
    if (!currentUser) return;
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const now = new Date();
        const currentHour = now.getHours();

        // Time Check: 6 AM (6) to 6 PM (18)
        if (currentHour < 6 || currentHour >= 18) {
          reject(new Error("Withdrawals are only allowed between 6 AM and 6 PM."));
          return;
        }

        if (amount < 150) {
            reject(new Error("Minimum withdrawal amount is ₹150."));
            return;
        }

        if (!currentUser.bankDetails) {
            reject(new Error("Please add bank details in Profile first."));
            return;
        }

        if (password && password !== currentUser.withdrawalPassword) {
            reject(new Error("Incorrect Withdrawal Password"));
            return;
        }

        if (currentUser.balance < amount) {
          reject(new Error("Insufficient balance"));
          return;
        }

        const taxAmount = amount * 0.10;
        const receiveAmount = amount - taxAmount;

        const newTx: Transaction = {
          id: `tx_${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          type: 'Withdraw',
          amount,
          date: new Date().toISOString(),
          status: 'Pending',
          description: `Withdraw: ₹${amount} (Tax: ₹${taxAmount}, Net: ₹${receiveAmount})`
        };
        
        setGlobalTransactions(prev => [newTx, ...prev]);
        
        const updatedUser = { ...currentUser, balance: currentUser.balance - amount };
        setCurrentUser(updatedUser);
        setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
        
        resolve();
      }, 500);
    });
  };

  // --- Admin Actions ---

  const adminApproveTransaction = (txId: string) => {
    const txIndex = globalTransactions.findIndex(t => t.id === txId);
    if (txIndex === -1) return;
    
    const tx = globalTransactions[txIndex];
    if (tx.status !== 'Pending') return;

    const updatedTx = { ...tx, status: 'Success' as const };
    const newTransactions = [...globalTransactions];
    newTransactions[txIndex] = updatedTx;
    setGlobalTransactions(newTransactions);

    if (tx.type === 'Deposit' && tx.userId) {
        setAllUsers(prev => prev.map(u => {
            if (u.id === tx.userId) {
                const updated = { ...u, balance: u.balance + tx.amount };
                if (currentUser && currentUser.id === u.id) setCurrentUser(updated);
                return updated;
            }
            return u;
        }));
    }
  };

  const adminRejectTransaction = (txId: string) => {
    const txIndex = globalTransactions.findIndex(t => t.id === txId);
    if (txIndex === -1) return;

    const tx = globalTransactions[txIndex];
    if (tx.status !== 'Pending') return;

    const updatedTx = { ...tx, status: 'Failed' as const };
    const newTransactions = [...globalTransactions];
    newTransactions[txIndex] = updatedTx;
    setGlobalTransactions(newTransactions);

    if (tx.type === 'Withdraw' && tx.userId) {
        setAllUsers(prev => prev.map(u => {
            if (u.id === tx.userId) {
                const updated = { ...u, balance: u.balance + tx.amount };
                if (currentUser && currentUser.id === u.id) setCurrentUser(updated);
                return updated;
            }
            return u;
        }));
    }
  };

  const adminUpdateBalance = (userId: string, newBalance: number) => {
      setAllUsers(prev => prev.map(u => {
          if (u.id === userId) {
              const updated = { ...u, balance: newBalance };
              if (currentUser && currentUser.id === u.id) setCurrentUser(updated);
              return updated;
          }
          return u;
      }));
  };

  const calculateTeamStats = (userId: string) => {
      // Find user to get referral code
      const targetUser = allUsers.find(u => u.id === userId);
      if (!targetUser) return { totalRecharge: 0, totalWithdraw: 0, teamSize: 0 };

      // Find all users referred by this user code
      const directReferrals = allUsers.filter(u => u.referredBy === targetUser.referralCode);
      
      let totalRecharge = 0;
      let totalWithdraw = 0;

      directReferrals.forEach(refUser => {
          const userTxs = globalTransactions.filter(t => t.userId === refUser.id && t.status === 'Success');
          const deposits = userTxs.filter(t => t.type === 'Deposit').reduce((acc, curr) => acc + curr.amount, 0);
          const withdraws = userTxs.filter(t => t.type === 'Withdraw').reduce((acc, curr) => acc + curr.amount, 0);
          
          totalRecharge += deposits;
          totalWithdraw += withdraws;
      });

      return {
          totalRecharge,
          totalWithdraw,
          teamSize: directReferrals.length
      };
  };

  // --- Investment Logic ---

  const invest = async (plan: InvestmentPlan) => {
    if (!currentUser) return;
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (currentUser.balance < plan.amount) {
          reject(new Error("Insufficient balance"));
          return;
        }

        const newTx: Transaction = {
          id: `tx_${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          type: 'Investment',
          amount: plan.amount,
          date: new Date().toISOString(),
          status: 'Success',
          description: `Invested in ${plan.name}`,
        };

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.durationDays);

        const newPlan: UserPlan = {
          id: `uplan_${Date.now()}`,
          planId: plan.id,
          name: plan.name,
          investedAmount: plan.amount,
          dailyReturn: plan.dailyReturn,
          startDate: new Date().toISOString(),
          endDate: endDate.toISOString(),
          status: 'Active'
        };

        setGlobalTransactions(prev => [newTx, ...prev]);
        setGlobalPlans(prev => [newPlan, ...prev]);

        const updatedUser = { ...currentUser, balance: currentUser.balance - plan.amount };
        setCurrentUser(updatedUser);
        setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

        resolve();
      }, 500);
    });
  };

  // --- Derived State ---
  
  const transactions = currentUser ? globalTransactions.filter(t => t.userId === currentUser.id) : [];
  const activePlans = currentUser ? globalPlans.filter(p => {
       // Only show plans for current user? In real app yes. 
       // For this prototype, let's filter if we stored userId in plans. 
       // Currently UserPlan doesn't have userId. 
       // We can assume globalPlans contains plans for current user or just show all for simplicity if we don't change UserPlan type.
       // Ideally we should match against user's transactions or add userId to UserPlan.
       // For now, let's keep it simple: Filter by matching transaction date roughly or just show all active plans (simplified).
       // Actually, best to just show all for the prototype user unless we add userId to UserPlan.
       return true; 
  }) : []; 
  
  const teamMembers = [] as TeamMember[]; // Computed in Team View or helper
  const pendingTransactions = currentUser?.isAdmin ? globalTransactions.filter(t => t.status === 'Pending') : [];

  return (
    <StoreContext.Provider value={{ 
      user: currentUser, 
      isAuthenticated: !!currentUser,
      allUsers,
      transactions, 
      activePlans, 
      availablePlans: INITIAL_PLANS, 
      teamMembers,
      pendingTransactions,
      login,
      register,
      logout,
      deposit, 
      withdraw, 
      invest,
      updateBankDetails,
      adminApproveTransaction,
      adminRejectTransaction,
      adminUpdateBalance,
      changePassword,
      changeWithdrawalPassword,
      calculateTeamStats
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
