'use client';

import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { MANTLE_CONTRACTS as CONTRACTS } from '@/lib/contracts/mantle_addresses';

interface LandingStats {
    // Borrowing Protocol Stats (V2)
    totalCollateral: string; // Total XAUT collateral in borrowing protocol
    totalCollateralIDR: string; // Total collateral value in IDR
    totalLoans: string; // Estimated total loans (collateral * avg LTV)
    xautPrice: string; // XAUT price in USD (approximate)
    xautPriceIdrx: string; // XAUT price in IDRX
    isLoading: boolean;
    error: Error | null;
}

export function useLandingStats(autoRefresh = true): LandingStats {
    const [refreshKey, setRefreshKey] = useState(0);

    // Approximate XAUT price (1 XAUT ≈ 1 oz gold ≈ $2,700)
    const xautPrice = '2,700';
    // Approximate XAUT price in IDRX (1 USD ≈ 15,500 IDR)
    const xautPriceIdrx = '41,850,000'; // 2,700 * 15,500

    // Fetch XAUT balance of BorrowingProtocolV2 (total collateral)
    const { data: borrowingCollateral, isLoading: loadingBorrowingCollateral } = useReadContract({
        address: CONTRACTS.XAUT,
        abi: [
            {
                inputs: [{ name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
        ],
        functionName: 'balanceOf',
        args: [CONTRACTS.BorrowingProtocolV2],
        query: {
            refetchInterval: autoRefresh ? 30000 : false,
        },
    });

    // Auto-refresh effect
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            setRefreshKey((prev) => prev + 1);
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [autoRefresh]);

    // Calculate borrowing stats
    const totalCollateral = borrowingCollateral
        ? formatUnits(borrowingCollateral as bigint, 6)
        : '0';

    const collateralInIDR = borrowingCollateral
        ? parseFloat(formatUnits(borrowingCollateral as bigint, 6)) * 41850000 // XAUT price in IDR
        : 0;

    const totalCollateralIDR = collateralInIDR > 0
        ? collateralInIDR.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })
        : 'Rp 0';

    // Estimate total loans (assuming average 30% LTV)
    const estimatedLoans = collateralInIDR * 0.3;
    const totalLoans = estimatedLoans > 0
        ? estimatedLoans.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })
        : 'Rp 0';

    return {
        totalCollateral,
        totalCollateralIDR,
        totalLoans,
        xautPrice,
        xautPriceIdrx,
        isLoading: loadingBorrowingCollateral,
        error: null,
    };
}
