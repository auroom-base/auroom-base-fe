/**
 * Loan State Persistence
 * 
 * Utilities for persisting loan wizard state to localStorage
 * to allow users to resume after page reload
 */

const LOAN_STATE_KEY = 'auroom_loan_state';
const STATE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface PersistedLoanState {
    step: 'borrow_complete' | 'redeem_pending';
    borrowedAmount: string; // Store as string for JSON serialization
    collateralAmount: string;
    txHash?: string;
    bankId?: string;
    accountNumber?: string;
    accountName?: string;
    timestamp: number;
}

/**
 * Save loan state after successful borrow
 */
export function saveLoanState(state: Omit<PersistedLoanState, 'timestamp'>): void {
    const stateWithTimestamp: PersistedLoanState = {
        ...state,
        timestamp: Date.now(),
    };

    try {
        localStorage.setItem(LOAN_STATE_KEY, JSON.stringify(stateWithTimestamp));
    } catch (e) {
        console.warn('Failed to save loan state to localStorage:', e);
    }
}

/**
 * Get persisted loan state (if valid and not expired)
 */
export function getLoanState(): PersistedLoanState | null {
    try {
        const stored = localStorage.getItem(LOAN_STATE_KEY);
        if (!stored) return null;

        const state: PersistedLoanState = JSON.parse(stored);

        // Check if expired
        if (Date.now() - state.timestamp > STATE_EXPIRY_MS) {
            clearLoanState();
            return null;
        }

        return state;
    } catch (e) {
        console.warn('Failed to read loan state from localStorage:', e);
        return null;
    }
}

/**
 * Clear loan state (after redeem complete or manual dismiss)
 */
export function clearLoanState(): void {
    try {
        localStorage.removeItem(LOAN_STATE_KEY);
    } catch (e) {
        console.warn('Failed to clear loan state from localStorage:', e);
    }
}

/**
 * Check if there's a pending loan state that matches blockchain state
 */
export function validateLoanState(
    persistedState: PersistedLoanState | null,
    hasActiveLoan: boolean,
    idrxBalance: bigint
): boolean {
    if (!persistedState) return false;
    if (!hasActiveLoan) return false;
    if (idrxBalance <= 0n) return false;

    return true;
}
