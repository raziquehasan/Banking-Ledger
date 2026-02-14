// User types
export interface User {
    _id: string;
    email: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

// Account types
export interface Account {
    _id: string;
    user: string;
    status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
    currency: string;
    createdAt: string;
    updatedAt: string;
}

export interface AccountBalance {
    accountId: string;
    balance: number;
}

// Transaction types
export interface Transaction {
    _id: string;
    fromAccount: string;
    toAccount: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
    amount: number;
    idempotencyKey: string;
    createdAt: string;
    updatedAt: string;
}

// Ledger types
export interface LedgerEntry {
    _id: string;
    account: string;
    amount: number;
    transaction: string;
    type: 'CREDIT' | 'DEBIT';
    createdAt: string;
}

// Form types
export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
}

export interface CreateAccountFormData {
    currency: string;
}

export interface TransferFormData {
    fromAccount: string;
    toAccount: string;
    amount: number;
}
