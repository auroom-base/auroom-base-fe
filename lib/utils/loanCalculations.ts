/**
 * Loan Calculations for Pinjam Tunai
 * 
 * All calculations use fixed 30% LTV (hidden from users)
 */

import { LOAN_CONFIG } from '@/lib/config/loanConfig';

export interface LoanCalculation {
    loanAmount: bigint;           // Nominal pinjaman (in IDRX, displayed as Rupiah)
    collateralRequired: bigint;   // XAUT yang dijaminkan
    collateralValue: bigint;      // Nilai jaminan dalam Rupiah
    fee: bigint;                  // Biaya layanan (0.5%)
    amountReceived: bigint;       // Yang diterima setelah fee
    isValid: boolean;             // Apakah bisa dilakukan
    errorMessage?: string;        // Pesan error jika tidak valid
}

/**
 * Calculate loan details with fixed 30% LTV
 * 
 * Formula:
 * collateralValue = loanAmount / 0.30 = loanAmount * 10000 / 3000
 * collateralXAUT = (collateralValue * 1e8) / xautPrice
 * fee = loanAmount * 0.5% = loanAmount * 50 / 10000
 * amountReceived = loanAmount - fee
 */
export function calculateLoan(
    loanAmount: bigint,
    xautPrice: bigint,
    xautBalance: bigint,
    ltvBps: number = LOAN_CONFIG.FIXED_LTV_BPS,
    feeBps: number = LOAN_CONFIG.FEE_BPS
): LoanCalculation {
    // Guard: zero input or loading price
    if (loanAmount === 0n || xautPrice === 0n) {
        return {
            loanAmount: loanAmount,
            collateralRequired: 0n,
            collateralValue: 0n,
            fee: 0n,
            amountReceived: 0n,
            isValid: false,
            errorMessage: xautPrice === 0n ? 'Loading price...' : 'Enter loan amount',
        };
    }

    // Calculate collateral value needed (at specified LTV)
    // collateralValue = loanAmount * 10000 / ltvBps
    const collateralValue = (loanAmount * 10000n) / BigInt(ltvBps);

    // Calculate XAUT needed
    // collateralRequired = (collateralValue * 1e8) / xautPrice
    // Add small buffer to avoid rounding issues
    const collateralRequired = (collateralValue * BigInt(1e8) + xautPrice - 1n) / xautPrice;

    // Calculate fee
    const fee = (loanAmount * BigInt(feeBps)) / 10000n;

    // Calculate amount received
    const amountReceived = loanAmount - fee;

    // Check if user has enough XAUT
    const isValid = xautBalance >= collateralRequired;
    const errorMessage = isValid
        ? undefined
        : `Insufficient gold. Need ${formatXAUT(collateralRequired)} XAUT, you have ${formatXAUT(xautBalance)} XAUT`;

    return {
        loanAmount,
        collateralRequired,
        collateralValue,
        fee,
        amountReceived,
        isValid,
        errorMessage,
    };
}

/**
 * Calculate maximum loan amount based on XAUT balance
 * Uses specified LTV (default 30%)
 */
export function calculateMaxLoan(
    xautBalance: bigint,
    xautPrice: bigint,
    ltvBps: number = LOAN_CONFIG.FIXED_LTV_BPS
): bigint {
    if (xautBalance === 0n) return 0n;

    // maxCollateralValue = (xautBalance * xautPrice) / 1e8
    const maxCollateralValue = (xautBalance * xautPrice) / BigInt(1e8);

    // maxLoan = (maxCollateralValue * LTV) / 10000
    const maxLoan = (maxCollateralValue * BigInt(ltvBps)) / 10000n;

    return maxLoan;
}

/**
 * Check if loan amount is within limits
 */
export function isLoanAmountValid(
    loanAmount: bigint,
    maxLoan: bigint
): { isValid: boolean; errorMessage?: string } {
    if (loanAmount === 0n) {
        return { isValid: false, errorMessage: 'Enter loan amount' };
    }

    if (loanAmount > maxLoan) {
        return {
            isValid: false,
            errorMessage: `Maximum loan: ${formatRupiah(maxLoan)}`
        };
    }

    return { isValid: true };
}

// Helper: Format XAUT
function formatXAUT(value: bigint): string {
    const num = Number(value) / 1e6;
    return num.toFixed(2);
}

// Helper: Format Rupiah
function formatRupiah(value: bigint): string {
    const num = Number(value) / 1e6;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
}
