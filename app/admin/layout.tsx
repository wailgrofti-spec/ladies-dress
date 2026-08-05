import { AdminAuthProvider } from '@/lib/admin-auth';
import { ToastProvider } from '@/components/admin/ui/Toast';
import AdminShell from '@/components/admin/AdminShell';

export const metadata = { title: 'Administration — Ladies Dress' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <ToastProvider>
        <AdminShell>{children}</AdminShell>
      </ToastProvider>
    </AdminAuthProvider>
  );
}
