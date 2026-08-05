import { getCustomers } from '@/lib/customers-data';
import CustomersTable from '@/components/admin/CustomersTable';

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 dark:text-white">Clientes</h1>
      <p className="mt-1 text-sm text-charcoal-700">
        Statut calculé automatiquement : Nouveau (1 commande), Fidèle (2+ commandes), VIP (5+ commandes
        ou plus de 2000 DH dépensés).
      </p>
      <div className="mt-6">
        <CustomersTable customers={customers} />
      </div>
    </div>
  );
}
