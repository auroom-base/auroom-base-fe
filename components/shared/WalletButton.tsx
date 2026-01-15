'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';

export function WalletButton() {
    const { address } = useAccount();
    const { data: balance } = useBalance({
        address: address,
    });

    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
            }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            style: {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button
                                        onClick={openConnectModal}
                                        type="button"
                                        className="w-full py-6 inline-flex items-center justify-center text-xl md:text-sm font-bold whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4"
                                    >
                                        Connect Wallet
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="w-full py-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-xl md:text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4"
                                    >
                                        Wrong network
                                    </button>
                                );
                            }

                            return (
                                <div className="flex flex-row gap-2">
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="w-full py-6 inline-flex items-center justify-center whitespace-nowrap rounded-xl md:rounded-4xl text-black text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-3"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background: chain.iconBackground,
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
                                                    marginRight: 8,
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                        style={{ width: 16, height: 16 }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {balance ? `${Number(formatUnits(balance.value, balance.decimals)).toFixed(4)} ${balance.symbol}` : '0.0000 MNT'}
                                    </button>

                                    <button
                                        onClick={openAccountModal}
                                        type="button"
                                        className="w-full py-6 inline-flex items-center justify-center whitespace-nowrap rounded-xl md:rounded-4xl text-black text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-3"
                                    >
                                        {account.displayName}
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}
