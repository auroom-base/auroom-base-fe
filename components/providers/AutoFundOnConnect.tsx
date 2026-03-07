// components/providers/AutoFundOnConnect.tsx
// Silent component that lives inside Web3Provider.
// Calls useAutoFund() to top-up gas on wallet connect.
// No UI — purely side-effect.

'use client'

import { useAutoFund } from '@/hooks/useAutoFund'

export function AutoFundOnConnect() {
    useAutoFund()
    return null
}
