import BigNumber from 'bignumber.js';

/**
 * Format a number with commas and decimals
 */
export function formatNumber(value: number | string, decimals: number = 2): string {
    const bn = new BigNumber(value);
    return bn.toFormat(decimals);
}

/**
 * Format currency with symbol
 */
export function formatCurrency(value: number | string, symbol: string = '$', decimals: number = 2): string {
    return `${symbol}${formatNumber(value, decimals)}`;
}

/**
 * Format token amount from BigInt with proper decimals
 */
export function formatTokenAmount(amount: bigint, decimals: number = 6, displayDecimals: number = 4): string {
    const bn = new BigNumber(amount.toString());
    const divisor = new BigNumber(10).pow(decimals);
    const result = bn.dividedBy(divisor);
    return result.toFormat(displayDecimals);
}

/**
 * Parse token amount from string to BigInt
 */
export function parseTokenAmount(amount: string, decimals: number = 6): bigint {
    if (!amount || amount === '') return BigInt(0);

    const bn = new BigNumber(amount);
    const multiplier = new BigNumber(10).pow(decimals);
    const result = bn.multipliedBy(multiplier);

    return BigInt(result.toFixed(0));
}

/**
 * Truncate Ethereum address
 */
export function formatAddress(address: string, startChars: number = 6, endChars: number = 4): string {
    if (!address) return '';
    if (address.length < startChars + endChars) return address;

    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number | string, decimals: number = 2): string {
    const bn = new BigNumber(value);
    return `${bn.toFormat(decimals)}%`;
}

/**
 * Format transaction hash
 */
export function formatTxHash(hash: string): string {
    return formatAddress(hash, 10, 8);
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactNumber(value: number | string): string {
    const bn = new BigNumber(value);

    if (bn.isGreaterThanOrEqualTo(1e9)) {
        return `${bn.dividedBy(1e9).toFormat(2)}B`;
    } else if (bn.isGreaterThanOrEqualTo(1e6)) {
        return `${bn.dividedBy(1e6).toFormat(2)}M`;
    } else if (bn.isGreaterThanOrEqualTo(1e3)) {
        return `${bn.dividedBy(1e3).toFormat(2)}K`;
    }

    return bn.toFormat(2);
}

/**
 * Get block explorer URL for transaction
 */
export function getExplorerTxUrl(txHash: string): string {
    const explorerUrl = process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://sepolia.basescan.org';
    return `${explorerUrl}/tx/${txHash}`;
}

/**
 * Format bigint as Indonesian Rupiah
 * For Pinjam Tunai interface
 */
export function formatRupiah(value: bigint, decimals: number = 6): string {
    const num = Number(value) / Math.pow(10, decimals);
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
}

/**
 * Format bigint as short Rupiah (Rp 1jt, Rp 10jt, etc)
 * For quick amount buttons
 */
export function formatRupiahShort(value: bigint, decimals: number = 6): string {
    const num = Number(value) / Math.pow(10, decimals);

    if (num >= 1_000_000_000) {
        return `Rp ${(num / 1_000_000_000).toFixed(1)}M`;
    } else if (num >= 1_000_000) {
        return `Rp ${(num / 1_000_000).toFixed(0)}jt`;
    } else if (num >= 1_000) {
        return `Rp ${(num / 1_000).toFixed(0)}rb`;
    }
    return `Rp ${num.toFixed(0)}`;
}

/**
 * Format XAUT amount
 */
export function formatXAUT(value: bigint): string {
    const num = Number(value) / 1e6;
    if (num === 0) return '0';
    if (num < 0.01) return num.toFixed(4);
    if (num < 1) return num.toFixed(3);
    return num.toFixed(2);
}

/**
 * Parse Rupiah input string to bigint
 * Removes all non-digit characters and converts to 6 decimals
 */
export function parseRupiahInput(value: string): bigint {
    const cleaned = value.replace(/[^\d]/g, '');
    if (!cleaned) return 0n;
    return BigInt(cleaned) * BigInt(1e6); // Convert to 6 decimals
}

/**
 * Format input with thousand separators
 * For real-time input formatting
 */
export function formatInputValue(value: string): string {
    const cleaned = value.replace(/[^\d]/g, '');
    if (!cleaned) return '';
    return Number(cleaned).toLocaleString('id-ID');
}

/**
 * Get loan status text based on LTV
 * For Pinjaman Aktif card
 */
export function getLoanStatus(ltvBps: number): { text: string; color: string } {
    if (ltvBps <= 5000) {
        return { text: 'AMAN', color: 'text-green-500' };
    } else if (ltvBps <= 7500) {
        return { text: 'PERHATIAN', color: 'text-yellow-500' };
    } else {
        return { text: 'BAHAYA', color: 'text-red-500' };
    }
}
