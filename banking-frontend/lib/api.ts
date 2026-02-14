import axiosInstance from './axios';
import type {
    AuthResponse,
    LoginFormData,
    RegisterFormData,
    Account,
    AccountBalance,
    CreateAccountFormData,
    Transaction,
    TransferFormData,
} from '@/types';

// Auth API
export const authAPI = {
    register: async (data: RegisterFormData): Promise<AuthResponse> => {
        const response = await axiosInstance.post('/auth/register', data);
        return response.data;
    },

    login: async (data: LoginFormData): Promise<AuthResponse> => {
        const response = await axiosInstance.post('/auth/login', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await axiosInstance.post('/auth/logout');
    },
};

// Account API
export const accountAPI = {
    getAccounts: async (): Promise<{ accounts: Account[] }> => {
        const response = await axiosInstance.get('/accounts');
        return response.data;
    },

    createAccount: async (data: CreateAccountFormData): Promise<{ account: Account }> => {
        const response = await axiosInstance.post('/accounts', data);
        return response.data;
    },

    getBalance: async (accountId: string): Promise<AccountBalance> => {
        const response = await axiosInstance.get(`/accounts/balance/${accountId}`);
        return response.data;
    },
};

// Transaction API
export const transactionAPI = {
    createTransaction: async (data: TransferFormData & { idempotencyKey: string }): Promise<{ transaction: Transaction; message: string }> => {
        const response = await axiosInstance.post('/transactions', data);
        return response.data;
    },

    getTransactionHistory: async (params?: {
        accountId?: string;
        status?: string;
        limit?: number;
        page?: number;
    }): Promise<{ transactions: Transaction[]; count: number; total: number; page: number; pages: number }> => {
        const response = await axiosInstance.get('/transactions', { params });
        return response.data;
    },

    getLedgerEntries: async (accountId: string, params?: {
        limit?: number;
        page?: number;
    }): Promise<{ accountId: string; entries: any[]; count: number; total: number; page: number; pages: number }> => {
        const response = await axiosInstance.get(`/ledger/${accountId}`, { params });
        return response.data;
    },
};
