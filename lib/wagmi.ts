import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mantleSepolia } from './contracts/chains';

export const config = getDefaultConfig({
    appName: 'AuRoom Protocol',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
    chains: [mantleSepolia],
    ssr: true,
});
