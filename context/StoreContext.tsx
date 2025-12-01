
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, InvestmentPlan, Transaction, User, UserPlan, TeamMember } from '../types';
import { db } from '../firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  onSnapshot, 
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore';

// Static Plans (Admin can enable/disable these via code or we can move to DB later)
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

// Special Admin Static User (Bypasses DB Auth for safety of the owner)
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
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [globalTransactions, setGlobalTransactions] = useState<Transaction[]>([]);
  const [globalPlans, setGlobalPlans] = useState<UserPlan[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // --- FIREBASE SYNC ---
  
  // Sync Users
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as User[];
      setAllUsers(usersData);
      
      // Real-time update for logged in user
      if (currentUser && !currentUser.isAdmin) {
        const updatedSelf = usersData.find(u => u.id === currentUser.id);
        if (updatedSelf) setCurrentUser(updatedSelf);
      }
    }, (error) => {
      console.error("Error fetching users:", error);
    });
    return () => unsubscribe();
  }, [currentUser?.id, currentUser?.isAdmin]);

  // Sync Transactions
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "transactions"), (snapshot) => {
      const txData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Transaction[];
      // Sort by date descending
      txData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setGlobalTransactions(txData);
    });
    return () => unsubscribe();
  }, []);

  // Sync Plans
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "user_plans"), (snapshot) => {
      const planData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as UserPlan[];
      setGlobalPlans(planData);
    });
    return () => unsubscribe();
  }, []);

  // --- Auth Actions ---

  const login = async (phone: string, pass: string) => {
    // 1. Check Hardcoded Admin
    if (phone === ADMIN_USER.phone && pass === ADMIN_USER.password) {
      setCurrentUser(ADMIN_USER);
      return;
    }

    // 2. Check Database Users
    const foundUser = allUsers.find(u => u.phone === phone && u.password === pass);
    if (foundUser) {
      setCurrentUser(foundUser);
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const register = async (name: string, phone: string, pass: string, refCode?: string) => {
    if (!name || phone.length < 10 || pass.length < 4) {
      throw new Error("Please fill all fields correctly");
    }

    // Check against local cache of users (which is synced with DB)
    if (allUsers.find(u => u.phone === phone)) {
      throw new Error("Phone number already registered");
    }

    const newUser: User = {
      id: 'u_' + Date.now(), // Will be overwritten by doc ref if we use addDoc, but setDoc allows custom ID or we ignore this in DB
      name: name,
      phone: phone,
      password: pass,
      withdrawalPassword: pass, 
      balance: 0,
      referralCode: 'CAT-' + Math.floor(1000 + Math.random() * 9000),
      referralEarnings: 0,
      teamCount: 0,
      kycVerified: false,
      referredBy: refCode || '',
      isAdmin: false
    };

    // Save to Firestore
    // We use the phone number as the doc ID to ensure uniqueness easily, or a random ID
    const userRef = doc(collection(db, "users")); 
    await setDoc(userRef, { ...newUser, id: userRef.id });
    
    // Auto login
    setCurrentUser({ ...newUser, id: userRef.id });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // --- User Actions ---

  const updateBankDetails = async (details: User['bankDetails']) => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.id);
    await updateDoc(userRef, { bankDetails: details });
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    if (!currentUser) return;
    if (currentUser.password !== oldPass) throw new Error("Incorrect old password");
    
    const userRef = doc(db, "users", currentUser.id);
    await updateDoc(userRef, { password: newPass });
  };

  const changeWithdrawalPassword = async (oldPass: string, newPass: string) => {
    if (!currentUser) return;
    if (currentUser.withdrawalPassword !== oldPass) throw new Error("Incorrect old withdrawal password");
    
    const userRef = doc(db, "users", currentUser.id);
    await updateDoc(userRef, { withdrawalPassword: newPass });
  };

  const deposit = async (amount: number, utr: string) => {
    if (!currentUser) return;
    
    const newTx: Omit<Transaction, 'id'> = {
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'Deposit',
      amount,
      date: new Date().toISOString(),
      status: 'Pending', 
      utr: utr,
      description: `Deposit via UTR: ${utr}`
    };

    await addDoc(collection(db, "transactions"), newTx);
  };

  const withdraw = async (amount: number, password?: string) => {
    if (!currentUser) return;
    
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour < 6 || currentHour >= 18) {
      throw new Error("Withdrawals are only allowed between 6 AM and 6 PM.");
    }
    if (amount < 150) {
      throw new Error("Minimum withdrawal amount is ₹150.");
    }
    if (!currentUser.bankDetails) {
      throw new Error("Please add bank details in Profile first.");
    }
    if (password && password !== currentUser.withdrawalPassword) {
      throw new Error("Incorrect Withdrawal Password");
    }
    if (currentUser.balance < amount) {
      throw new Error("Insufficient balance");
    }

    const taxAmount = amount * 0.10;
    const receiveAmount = amount - taxAmount;

    // Deduct balance immediately
    const userRef = doc(db, "users", currentUser.id);
    await updateDoc(userRef, { balance: currentUser.balance - amount });

    const newTx: Omit<Transaction, 'id'> = {
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'Withdraw',
      amount,
      date: new Date().toISOString(),
      status: 'Pending',
      description: `Withdraw: ₹${amount} (Tax: ₹${taxAmount}, Net: ₹${receiveAmount})`
    };

    await addDoc(collection(db, "transactions"), newTx);
  };

  const invest = async (plan: InvestmentPlan) => {
    if (!currentUser) return;
    if (currentUser.balance < plan.amount) {
      throw new Error("Insufficient balance");
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    // 1. Deduct Balance
    const userRef = doc(db, "users", currentUser.id);
    await updateDoc(userRef, { balance: currentUser.balance - plan.amount });

    // 2. Add Transaction
    const newTx: Omit<Transaction, 'id'> = {
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'Investment',
      amount: plan.amount,
      date: new Date().toISOString(),
      status: 'Success',
      description: `Invested in ${plan.name}`,
    };
    await addDoc(collection(db, "transactions"), newTx);

    // 3. Add User Plan
    const newPlan: Omit<UserPlan, 'id'> = {
      planId: plan.id,
      name: plan.name,
      investedAmount: plan.amount,
      dailyReturn: plan.dailyReturn,
      startDate: new Date().toISOString(),
      endDate: endDate.toISOString(),
      status: 'Active'
    };
    await addDoc(collection(db, "user_plans"), { ...newPlan, userId: currentUser.id }); // Add userId to plan for filtering
  };

  // --- Admin Actions ---

  const adminApproveTransaction = async (txId: string) => {
    const tx = globalTransactions.find(t => t.id === txId);
    if (!tx || tx.status !== 'Pending') return;

    const txRef = doc(db, "transactions", txId);
    await updateDoc(txRef, { status: 'Success' });

    if (tx.type === 'Deposit' && tx.userId) {
      const user = allUsers.find(u => u.id === tx.userId);
      if (user) {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, { balance: user.balance + tx.amount });

        // Handle Referral Bonus (if any logic needed later)
      }
    }
  };

  const adminRejectTransaction = async (txId: string) => {
    const tx = globalTransactions.find(t => t.id === txId);
    if (!tx || tx.status !== 'Pending') return;

    const txRef = doc(db, "transactions", txId);
    await updateDoc(txRef, { status: 'Failed' });

    // Refund if withdrawal failed
    if (tx.type === 'Withdraw' && tx.userId) {
      const user = allUsers.find(u => u.id === tx.userId);
      if (user) {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, { balance: user.balance + tx.amount });
      }
    }
  };

  const adminUpdateBalance = async (userId: string, newBalance: number) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { balance: newBalance });
  };

  const calculateTeamStats = (userId: string) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return { totalRecharge: 0, totalWithdraw: 0, teamSize: 0 };

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

  // --- Derived State ---
  
  const transactions = currentUser ? globalTransactions.filter(t => t.userId === currentUser.id) : [];
  
  // Filter plans for current user. 
  // Note: We need to filter globalPlans based on userId. 
  // Since we added userId to the doc in `invest`, we check `(p as any).userId`.
  const activePlans = currentUser ? globalPlans.filter(p => (p as any).userId === currentUser.id) : [];
  
  const teamMembers = [] as TeamMember[]; // Computed elsewhere if needed, or we can compute real team here
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
