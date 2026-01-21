'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { formatUnits } from 'viem';
import { useMiniAppContext } from '@/components/ClientProviders';

// Base Sepolia chain ID
const BASE_SEPOLIA_CHAIN_ID = 84532;

export function WalletButton() {
    const { address, isConnecting, chainId } = useAccount();
    const { data: balance } = useBalance({
        address: address,
    });
    const { isInMiniApp, isLoading: isMiniAppLoading } = useMiniAppContext();
    const { switchChain, isPending: isSwitching } = useSwitchChain();

    // Check if on wrong network
    const isWrongNetwork = chainId !== undefined && chainId !== BASE_SEPOLIA_CHAIN_ID;

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
                            // Show connecting state when in Mini App and auto-connecting
                            const isAutoConnecting = isInMiniApp && (isConnecting || isMiniAppLoading);

                            if (isAutoConnecting) {
                                return (
                                    <button
                                        type="button"
                                        disabled
                                        className="w-full py-6 inline-flex items-center justify-center text-xl md:text-sm font-bold whitespace-nowrap rounded-md bg-primary/50 text-primary-foreground h-10 px-4 cursor-wait"
                                    >
                                        <span className="animate-pulse">Connecting...</span>
                                    </button>
                                );
                            }

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

                            // Use wagmi v2 chain detection - check if chainId doesn't match Base Sepolia
                            if (isWrongNetwork || chain.unsupported) {
                                return (
                                    <button
                                        onClick={() => switchChain({ chainId: BASE_SEPOLIA_CHAIN_ID })}
                                        disabled={isSwitching}
                                        type="button"
                                        className="w-full py-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-xl md:text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4"
                                    >
                                        {isSwitching ? (
                                            <span className="animate-pulse">Switching...</span>
                                        ) : (
                                            'Switch to Base Sepolia'
                                        )}
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
                                        {balance ? `${Number(formatUnits(balance.value, balance.decimals)).toFixed(4)} ${balance.symbol}` : '0.0000 ETH'}
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

