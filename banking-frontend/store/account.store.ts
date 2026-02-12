import { create } from 'zustand';
import type { Account } from '@/types';

interface AccountState {
    accounts: Account[];
    setAccounts: (accounts: Account[]) => void;
    addAccount: (account: Account) => void;
    clearAccounts: () => void;
}

export const useAccountStore = create<AccountState>((set) => ({
    accounts: [],
    setAccounts: (accounts) => set({ accounts }),
    addAccount: (account) => set((state) => ({ accounts: [...state.accounts, account] })),
    clearAccounts: () => set({ accounts: [] }),
}));
