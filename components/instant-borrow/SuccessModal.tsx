'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'borrow' | 'repay' | 'redeem' | 'close';
    data: {
        amount?: string;
        fee?: string;
        txHash?: string;
        bank?: string;
        accountNumber?: string;
        referenceNumber?: string;
    };
    onContinue?: () => void;
}

export function SuccessModal({
    isOpen,
    onClose,
    type,
    data,
    onContinue,
}: SuccessModalProps) {
    const getTitle = () => {
        switch (type) {
            case 'borrow':
                return '✅ Borrow Successful!';
            case 'repay':
                return '✅ Repayment Successful!';
            case 'close':
                return '✅ Position Closed!';
            case 'redeem':
                return '✅ Redeem Successful (Simulasi)';
            default:
                return '✅ Success!';
        }
    };

    const getMessage = () => {
        switch (type) {
            case 'borrow':
                return 'Your collateral has been deposited and IDRX has been borrowed successfully.';
            case 'repay':
                return 'Your debt has been repaid and collateral withdrawn successfully.';
            case 'close':
                return 'Your entire position has been closed. All debt repaid and collateral withdrawn.';
            case 'redeem':
                return 'Ini adalah simulasi. Di production, IDRX akan dikonversi ke IDR melalui partner bank.';
            default:
                return 'Transaction completed successfully.';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-900 border-2 border-yellow-500/30 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                        {getTitle()}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <p className="text-white/80 text-center">{getMessage()}</p>

                    {/* Transaction Details */}
                    <div className="p-4 rounded-xl bg-black/40 space-y-2">
                        {data.amount && (
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Amount:</span>
                                <span className="font-semibold">{data.amount}</span>
                            </div>
                        )}
                        {data.fee && (
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Fee:</span>
                                <span className="font-semibold">{data.fee}</span>
                            </div>
                        )}
                        {data.bank && (
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Bank:</span>
                                <span className="font-semibold">{data.bank}</span>
                            </div>
                        )}
                        {data.accountNumber && (
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Account:</span>
                                <span className="font-semibold">{data.accountNumber}</span>
                            </div>
                        )}
                        {data.referenceNumber && (
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Reference:</span>
                                <span className="font-semibold text-yellow-400">
                                    {data.referenceNumber}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Transaction Hash Link */}
                    {data.txHash && (
                        <a
                            href={`https://sepolia.basescan.org/tx/${data.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                            View on Explorer
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}

                    {/* Simulation Warning */}
                    {type === 'redeem' && (
                        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                            <p className="text-xs text-yellow-400 text-center">
                                ⚠️ Demo Mode: Transfer ke bank adalah simulasi
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    {onContinue && type === 'borrow' && (
                        <Button
                            onClick={onContinue}
                            className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold"
                        >
                            Continue to Redeem
                        </Button>
                    )}
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className={cn(
                            'border-yellow-500/30 text-white hover:bg-yellow-500/10',
                            !onContinue || type !== 'borrow' ? 'flex-1' : ''
                        )}
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
