import { AdminPage } from '@/components/features/admin/AdminPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Helper Tools | AuRoom Protocol',
    description: 'Testing and debugging utilities for AuRoom Protocol on Base Sepolia',
};

export default function AdminHelperPage() {
    return <AdminPage />;
}
