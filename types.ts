
export type TransactionStatus = 'Pending' | 'Processing' | 'Success' | 'Failed' | 'Completed';
export type TransactionType = 'Deposit' | 'Withdraw' | 'Investment' | 'Referral';

export interface Transaction {
  id: string;
  userId?: string; // For admin to know who did it
  userName?: string;
  type: TransactionType;
  amount: number;
  date: string; // ISO String
  status: TransactionStatus;
  description?: string;
  utr?: string; // Unique Transaction Reference for deposits
}

export interface InvestmentPlan {
  id: string;
  name: string;
  amount: number;
  dailyReturn: number;
  durationDays: number;
  totalReturn: number;
  description: string;
  imageUrl?: string;
  status: 'Active' | 'Coming Soon';
}

export interface UserPlan {
  id: string;
  planId: string;
  name: string;
  investedAmount: number;
  dailyReturn: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed';
}

export interface TeamMember {
  id: string;
  name: string;
  phone: string;
  joinDate: string;
  totalDeposit: number;
  totalWithdraw: number;
  level: number;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  password?: string;
  withdrawalPassword?: string; // New field
  balance: number;
  referralCode: string;
  referralEarnings: number;
  teamCount: number;
  kycVerified: boolean;
  bankDetails?: {
    accountNumber: string;
    ifsc: string;
    holderName: string;
  };
  referredBy?: string;
  isAdmin?: boolean;
}

export interface AppState {
  user: User | null;
  transactions: Transaction[];
  activePlans: UserPlan[];
  availablePlans: InvestmentPlan[];
  teamMembers: TeamMember[];
  pendingTransactions: Transaction[]; // For admin
}

export enum View {
  HOME = 'HOME',
  TEAM = 'TEAM',
  HISTORY = 'HISTORY',
  PROFILE = 'PROFILE',
  ADMIN = 'ADMIN',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  INVITE = 'INVITE'
}
