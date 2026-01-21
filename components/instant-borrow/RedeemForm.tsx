'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ProcessingOverlay } from './ProcessingOverlay';
import { SuccessModal } from './SuccessModal';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { useTokenBalance } from '@/hooks/contracts/useTokenBalance';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';
import { simulateRedeem, SUPPORTED_BANKS } from '@/lib/redeem/simulation';
import { Building2, AlertTriangle } from 'lucide-react';

export function RedeemForm() {
    const { address } = useAccount();
    const [amountInput, setAmountInput] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [redeemResult, setRedeemResult] = useState<any>(null);

    // Get IDRX balance
    const { data: idrxBalance } = useTokenBalance(CONTRACTS.IDRX, address);

    // Format functions
    const formatIDR = (value: bigint | undefined) => {
        if (!value) return 'Rp 0';
        const num = Number(formatUnits(value, 6));
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    };

    // Handle percentage buttons
    const handlePercentage = (percent: number) => {
        if (!idrxBalance) return;
        const amount = ((idrxBalance as bigint) * BigInt(percent)) / BigInt(100);
        setAmountInput(formatUnits(amount, 6));
    };

    // Handle redeem
    const handleRedeem = async () => {
        if (!amountInput || !selectedBank || !accountNumber || !accountName) return;

        const amount = parseUnits(amountInput, 6);

        setIsProcessing(true);

        try {
            const result = await simulateRedeem({
                amount,
                bank: SUPPORTED_BANKS.find(b => b.id === selectedBank)?.name || selectedBank,
                accountNumber,
                accountName,
            });

            setRedeemResult(result);
            setShowSuccess(true);

            // Reset form
            setAmountInput('');
            setSelectedBank('');
            setAccountNumber('');
            setAccountName('');
        } catch (error) {
            console.error('Redeem simulation error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const isFormValid =
        amountInput &&
        selectedBank &&
        accountNumber &&
        accountName &&
        parseUnits(amountInput || '0', 6) > BigInt(0);

    return (
        <>
            <div className="space-y-6">
                {/* Warning Banner */}
                <div className="p-4 rounded-xl bg-yellow-500/10 border-2 border-yellow-500/30 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-yellow-400 font-semibold mb-1">Demo Mode</p>
                        <p className="text-white/80 text-sm">
                            Transfer ke bank adalah simulasi. Di production, IDRX akan dikonversi ke IDR melalui partner bank dan ditransfer dalam 1-2 hari kerja.
                        </p>
                    </div>
                </div>

                {/* Balance Display */}
                <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30">
                    <div className="flex items-center justify-between">
                        <span className="text-white/60">Your IDRX Balance:</span>
                        <span className="text-2xl font-bold text-white">
                            {idrxBalance ? formatIDR(idrxBalance as bigint) : formatIDR(BigInt(0))}
                        </span>
                    </div>
                </div>

                {/* Amount Input */}
                <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Amount to Redeem</h3>

                    <div className="space-y-3">
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={amountInput}
                            onChange={(e) => setAmountInput(e.target.value)}
                            className="bg-black/40 border-yellow-500/30 text-white text-lg h-12"
                        />

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePercentage(25)}
                                className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10"
                            >
                                25%
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePercentage(50)}
                                className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10"
                            >
                                50%
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePercentage(100)}
                                className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10"
                            >
                                100%
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bank Selection */}
                <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Select Bank</h3>

                    <RadioGroup value={selectedBank} onValueChange={setSelectedBank}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {SUPPORTED_BANKS.map((bank) => (
                                <div key={bank.id} className="relative">
                                    <RadioGroupItem
                                        value={bank.id}
                                        id={bank.id}
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor={bank.id}
                                        className="flex items-center justify-center p-4 rounded-lg border-2 border-yellow-500/20 bg-black/40 cursor-pointer hover:bg-yellow-500/10 peer-data-[state=checked]:border-yellow-500 peer-data-[state=checked]:bg-yellow-500/20 transition-all"
                                    >
                                        <span className="text-white font-semibold">{bank.name}</span>
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                </div>

                {/* Account Details */}
                <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30 space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>

                    <div className="space-y-2">
                        <Label htmlFor="accountNumber" className="text-white/80">
                            Account Number
                        </Label>
                        <Input
                            id="accountNumber"
                            type="text"
                            placeholder="1234567890"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="bg-black/40 border-yellow-500/30 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="accountName" className="text-white/80">
                            Account Holder Name
                        </Label>
                        <Input
                            id="accountName"
                            type="text"
                            placeholder="John Doe"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            className="bg-black/40 border-yellow-500/30 text-white"
                        />
                    </div>
                </div>

                {/* Summary */}
                {isFormValid && (
                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-yellow-500/20">
                        <h3 className="text-sm font-semibold text-yellow-400 mb-3">Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/60">Redeem:</span>
                                <span className="text-white font-semibold">
                                    {formatIDR(parseUnits(amountInput, 6))}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Fee:</span>
                                <span className="text-white font-semibold">Rp 0 (demo)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">You receive:</span>
                                <span className="text-yellow-400 font-semibold">
                                    {formatIDR(parseUnits(amountInput, 6))} IDR
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Bank:</span>
                                <span className="text-white font-semibold">
                                    {SUPPORTED_BANKS.find(b => b.id === selectedBank)?.name} - {accountNumber} - {accountName}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <Button
                    onClick={handleRedeem}
                    disabled={!isFormValid || isProcessing}
                    className="w-full h-14 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold text-lg"
                >
                    <Building2 className="w-5 h-5 mr-2" />
                    REDEEM TO BANK
                </Button>
            </div>

            {/* Processing Overlay */}
            <ProcessingOverlay
                isVisible={isProcessing}
                message="Processing transfer to bank..."
            />

            {/* Success Modal */}
            {redeemResult && (
                <SuccessModal
                    isOpen={showSuccess}
                    onClose={() => {
                        setShowSuccess(false);
                        setRedeemResult(null);
                    }}
                    type="redeem"
                    data={{
                        amount: formatIDR(redeemResult.amount),
                        bank: redeemResult.bank,
                        accountNumber: redeemResult.accountNumber,
                        referenceNumber: redeemResult.referenceNumber,
                    }}
                />
            )}
        </>
    );
}
