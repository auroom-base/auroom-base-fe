'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProcessingOverlay } from '@/components/cash-loan/ProcessingOverlay';
import { SuccessModal } from '@/components/cash-loan/SuccessModal';
import { RedeemModal } from '@/components/redeem/RedeemModal';
import { CashLoanWizard } from '@/components/cash-loan/CashLoanWizard';
import {
    useGoldBalance,
    useGoldPrice,
    useActiveLoan,
    useIDRXBalance,
    useLoanCalculation,
    useXAUTApproval,
    useIDRXApproval,
    useBorrow,
    useRepay,
} from '@/hooks/useLoan';
import { parseRupiahInput } from '@/lib/utils/format';
import { type LoanFlowState, generateReferenceNumber } from '@/lib/utils/loanFlow';
import { VerificationBanner } from '@/components/shared/VerificationBanner';
import { WrongNetworkBanner } from '@/components/shared/WrongNetworkBanner';

export default function CashLoanPage() {
    const router = useRouter();
    const { address, isConnected } = useAccount();

    // Redirect to landing page if wallet disconnects
    useEffect(() => {
        if (!isConnected) {
            router.push('/');
        }
    }, [isConnected, router]);

    // State
    const [loanInput, setLoanInput] = useState('');
    const [selectedBank, setSelectedBank] = useState('bca');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [selectedLTV, setSelectedLTV] = useState(30); // Default 30%
    const [showRepayModal, setShowRepayModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [successData, setSuccessData] = useState<any>({});
    const [flowState, setFlowState] = useState<LoanFlowState>({ step: 'idle', message: '' });
    const [savedBankDetails, setSavedBankDetails] = useState<{
        bank: string;
        accountNumber: string;
        accountName: string;
    } | null>(null);

    // Hooks
    const { balance: goldBalance, isLoading: goldLoading } = useGoldBalance();
    const { price: goldPrice, isLoading: priceLoading } = useGoldPrice();
    const activeLoan = useActiveLoan();
    const { balance: idrxBalance } = useIDRXBalance();

    // Parse loan amount
    const loanAmount = loanInput ? parseRupiahInput(loanInput) : 0n;
    const ltvBps = selectedLTV * 100; // Convert percentage to basis points
    const calculation = useLoanCalculation(loanAmount, ltvBps);

    // Calculate gold value
    const goldValue = (goldBalance * goldPrice) / BigInt(1e8);

    // Approvals
    const xautApproval = useXAUTApproval();
    const idrxApproval = useIDRXApproval();

    // Transactions
    const borrow = useBorrow();
    const repay = useRepay();

    const needsApproval = xautApproval.allowance < calculation.collateralRequired;

    // Handle approve — approve 5× collateral needed so one approval covers multiple sessions.
    // Exact amount gets consumed by depositAndBorrow, requiring re-approval every time.
    const handleApprove = () => {
        xautApproval.approve(calculation.collateralRequired * 5n);
    };


    // Handle borrow
    const handleBorrow = () => {
        setFlowState({ step: 'borrowing', message: 'Securing gold collateral...' });
        borrow.execute(calculation.collateralRequired, loanAmount);
    };

    // Handle repay
    const handleRepay = (amount: bigint, isFullRepay: boolean) => {
        setFlowState({ step: 'borrowing', message: 'Repaying loan...' });
        // If full repay, withdraw all collateral. Otherwise, no withdrawal
        const withdrawAmount = isFullRepay ? activeLoan.collateral : 0n;
        repay.execute(amount, withdrawAmount);
    };

    // Refetch allowance after approval
    useEffect(() => {
        if (xautApproval.isSuccess) {
            xautApproval.refetchAllowance();
        }
    }, [xautApproval.isSuccess]);

    // Handle borrow success - DISABLED: Wizard handles transition to Step 2
    // The wizard will automatically move to Step 2 when borrowSuccess is true
    // Success modal will only show after Step 2 completion (wizard onComplete callback)
    /*
    useEffect(() => {
        if (borrow.isSuccess) {
            const referenceNumber = generateReferenceNumber();

            // Save bank details for redeem flow
            setSavedBankDetails({
                bank: selectedBank,
                accountNumber,
                accountName,
            });

            setSuccessData({
                loanAmount,
                collateral: calculation.collateralRequired,
                fee: calculation.fee,
                amountReceived: calculation.amountReceived,
                bankId: selectedBank,
                accountNumber,
                accountName,
                referenceNumber,
                txHash: borrow.hash,
            });
            setFlowState({ step: 'success', message: 'Loan successful!' });
            setShowSuccessModal(true);
            setLoanInput('');
            setAccountNumber('');
            setAccountName('');
            borrow.reset();
            activeLoan.refetch();
        }
    }, [borrow.isSuccess]);
    */

    // Handle repay success
    useEffect(() => {
        if (repay.isSuccess) {
            setSuccessData({
                loanAmount: activeLoan.debt,
                collateral: activeLoan.collateral,
            });
            setFlowState({ step: 'success', message: 'Repayment successful!' });
            setShowSuccessModal(true);
            setShowRepayModal(false);
            repay.reset();
            activeLoan.refetch();
        }
    }, [repay.isSuccess]);

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-black py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">INSTANT CASH LOAN</h1>
                    <p className="text-white/70 text-lg mb-8">
                        Secure your gold, receive cash to your bank account
                    </p>
                    <p className="text-white/60">
                        Please connect your wallet to continue
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent mb-2">
                        Cash Loan
                    </h1>
                    <p className="text-white/60">Secure your digital gold, receive cash to your bank account</p>
                </div>

                {/* Network guard */}
                <WrongNetworkBanner />

                {/* Verification Banner */}
                <VerificationBanner />

                {/* Cash Loan Wizard */}
                <CashLoanWizard
                    goldBalance={goldBalance}
                    goldValue={goldValue}
                    goldPrice={goldPrice}
                    goldLoading={goldLoading || priceLoading}
                    calculation={calculation}
                    needsApproval={needsApproval}
                    onApprove={handleApprove}
                    approvalPending={xautApproval.isPending}
                    approvalConfirming={xautApproval.isConfirming}
                    approvalSuccess={xautApproval.isSuccess}
                    onBorrow={handleBorrow}
                    borrowPending={borrow.isPending}
                    borrowConfirming={borrow.isConfirming}
                    borrowSuccess={borrow.isSuccess}
                    loanInput={loanInput}
                    onLoanInputChange={setLoanInput}
                    selectedLTV={selectedLTV}
                    onLTVChange={setSelectedLTV}
                    selectedBank={selectedBank}
                    onBankChange={setSelectedBank}
                    accountNumber={accountNumber}
                    onAccountNumberChange={setAccountNumber}
                    accountName={accountName}
                    onAccountNameChange={setAccountName}
                    onComplete={(data) => {
                        // Wizard completed, trigger redeem flow
                        const referenceNumber = generateReferenceNumber();

                        setSavedBankDetails({
                            bank: data.bankId,
                            accountNumber: data.accountNumber,
                            accountName: data.accountName,
                        });

                        setSuccessData({
                            loanAmount: data.loanAmount,
                            collateral: calculation.collateralRequired,
                            fee: calculation.fee,
                            amountReceived: data.amountReceived,
                            bankId: data.bankId,
                            accountNumber: data.accountNumber,
                            accountName: data.accountName,
                            referenceNumber,
                            txHash: borrow.hash,
                        });

                        // Reset form state
                        setLoanInput('');
                        setAccountNumber('');
                        setAccountName('');

                        // Reset transaction state
                        borrow.reset();

                        // Refetch active loan to show updated position
                        activeLoan.refetch();

                        // Show success modal
                        setShowSuccessModal(true);
                    }}
                />

                {/* Processing Overlay */}
                {(borrow.isPending || borrow.isConfirming || repay.isPending || repay.isConfirming) && (
                    <ProcessingOverlay state={flowState} />
                )}

                {/* Success Modal */}
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => {
                        setShowSuccessModal(false);
                        setFlowState({ step: 'idle', message: '' });
                    }}
                    type={successData.bankId ? 'borrow' : 'repay'}
                    data={successData}
                    onRedeem={() => {
                        setShowSuccessModal(false);
                        setShowRedeemModal(true);
                    }}
                />

                {/* Redeem Modal */}
                <RedeemModal
                    isOpen={showRedeemModal}
                    onClose={() => setShowRedeemModal(false)}
                    idrxBalance={idrxBalance}
                    bankDetails={savedBankDetails || undefined}
                    prefilledAmount={successData.amountReceived}
                />
            </div>
        </div>
    );
}
