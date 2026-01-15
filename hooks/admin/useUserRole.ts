import { useAccount } from 'wagmi';
import { useIdentityRegistry } from '@/hooks/contracts/useIdentityRegistry';
import { DEPLOYER } from '@/lib/contracts/mantle_addresses';

export type UserRole = 'guest' | 'connected' | 'verified' | 'admin' | 'owner';

/**
 * Hook to determine the user's role for access control
 * Roles: guest (not connected), connected, verified, admin, owner
 */
export function useUserRole(): UserRole {
    const { address, isConnected } = useAccount();
    const { useIsVerified } = useIdentityRegistry();
    const { data: isVerified } = useIsVerified(address);

    if (!isConnected || !address) return 'guest';

    // Owner is the deployer address
    if (address.toLowerCase() === DEPLOYER.toLowerCase()) return 'owner';

    // For now, owner is also admin
    // In production, you would check isAdmin from IdentityRegistry
    // const { isAdmin } = useIsAdmin(address);
    // if (isAdmin) return 'admin';

    if (isVerified) return 'verified';

    return 'connected';
}
