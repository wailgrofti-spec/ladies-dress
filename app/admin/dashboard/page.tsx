import { getProducts, totalStock } from '@/lib/data';
import { getOrders } from '@/lib/orders-data';
import { formatPrice } from '@/lib/utils';
import { Package, ShoppingCart, TrendingUp, AlertCircle, Users, Percent } from 'lucide-react';
import { RevenueTrendChart, TopProductsChart } from '@/components/admin/DashboardCharts';

const REVENUE_STATUSES = ['confirmee', 'en_preparation', 'expediee', 'livree'];

export default async function DashboardPage() {
  const products = await getProducts();
  const orders = await getOrders();

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const validOrders = orders.filter((o) => REVENUE_STATUSES.includes(o.status));
  const sumSince = (date: Date) => validOrders.filter((o) => new Date(o.created_at) >= date).reduce((s, o) => s + o.total, 0);

  const revenueToday = sumSince(startOfDay);
  const revenueWeek = sumSince(startOfWeek);
  const revenueMonth = sumSince(startOfMonth);

  const ordersToday = orders.filter((o) => new Date(o.created_at) >= startOfDay);
  const pending = orders.filter((o) => ['nouvelle', 'a_confirmer'].includes(o.status)).length;
  const confirmed = orders.filter((o) => o.status === 'confirmee').length;
  const shipped = orders.filter((o) => o.status === 'expediee').length;
  const delivered = orders.filter((o) => o.status === 'livree').length;
  const refused = orders.filter((o) => ['annulee', 'refusee', 'retournee'].includes(o.status)).length;

  const lowStock = products.filter((p) => totalStock(p) > 0 && totalStock(p) <= 5);
  const outOfStock = products.filter((p) => totalStock(p) === 0);

  const avgBasket = validOrders.length > 0 ? validOrders.reduce((s, o) => s + o.total, 0) / validOrders.length : 0;

  const phoneCounts = new Map<string, number>();
  orders.forEach((o) => phoneCounts.set(o.phone, (phoneCounts.get(o.phone) ?? 0) + 1));
  const newCustomers = Array.from(phoneCounts.values()).filter((c) => c === 1).length;

  const salesByProduct = new Map<string, number>();
  validOrders.forEach((o) => o.items.forEach((i) => {
    salesByProduct.set(i.product_name, (salesByProduct.get(i.product_name) ?? 0) + i.quantity);
  }));
  const topProducts = Array.from(salesByProduct.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, sales]) => ({ name: name.length > 18 ? name.slice(0, 16) + '…' : name, sales }));

  const salesByCity = new Map<string, number>();
  validOrders.forEach((o) => salesByCity.set(o.city, (salesByCity.get(o.city) ?? 0) + o.total));
  const topCities = Array.from(salesByCity.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const trend: { date: string; revenue: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const day = new Date(startOfDay);
    day.setDate(startOfDay.getDate() - i);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    const revenue = validOrders
      .filter((o) => new Date(o.created_at) >= day && new Date(o.created_at) < nextDay)
      .reduce((s, o) => s + o.total, 0);
    trend.push({ date: day.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }), revenue });
  }

  const stats = [
    { label: "CA aujourd'hui", value: formatPrice(revenueToday), icon: TrendingUp },
    { label: 'CA cette semaine', value: formatPrice(revenueWeek), icon: TrendingUp },
    { label: 'CA ce mois', value: formatPrice(revenueMonth), icon: TrendingUp },
    { label: 'Panier moyen', value: formatPrice(Math.round(avgBasket)), icon: Percent },
    { label: 'Commandes totales', value: orders.length, icon: ShoppingCart },
    { label: "Commandes aujourd'hui", value: ordersToday.length, icon: ShoppingCart },
    { label: 'Nouvelles clientes', value: newCustomers, icon: Users },
    { label: 'Produits actifs', value: products.length, icon: Package },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 dark:text-white">Tableau de bord</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-4">
              <Icon className="text-rosegold-400" size={20} />
              <p className="mt-2 text-xl font-semibold text-charcoal-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-charcoal-700">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <p className="font-semibold text-charcoal-800">Évolution des ventes (14 jours)</p>
          <div className="mt-2">
            <RevenueTrendChart data={trend} />
          </div>
        </div>
        <div className="card p-5">
          <p className="font-semibold text-charcoal-800">Produits les plus vendus</p>
          <div className="mt-2">
            {topProducts.length > 0 ? (
              <TopProductsChart data={topProducts} />
            ) : (
              <p className="py-16 text-center text-sm text-charcoal-700">Pas encore de ventes.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-5">
          <p className="font-semibold text-charcoal-800">Statuts des commandes</p>
          <div className="mt-4 space-y-2 text-sm">
            <StatusRow label="En attente" value={pending} color="bg-gold-400" />
            <StatusRow label="Confirmées" value={confirmed} color="bg-rosegold-400" />
            <StatusRow label="Expédiées" value={shipped} color="bg-charcoal-700" />
            <StatusRow label="Livrées" value={delivered} color="bg-green-500" />
            <StatusRow label="Refusées / retournées" value={refused} color="bg-red-500" />
          </div>
        </div>

        <div className="card p-5">
          <p className="font-semibold text-charcoal-800">Villes générant le plus de ventes</p>
          <div className="mt-4 space-y-2 text-sm">
            {topCities.length === 0 && <p className="text-charcoal-700">Pas encore de données.</p>}
            {topCities.map(([city, total]) => (
              <div key={city} className="flex justify-between">
                <span className="text-charcoal-700">{city}</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <p className="flex items-center gap-2 font-semibold text-charcoal-800">
            <AlertCircle size={18} className="text-rosegold-400" /> Alertes stock
          </p>
          <div className="mt-4 space-y-2 text-sm">
            {outOfStock.length === 0 && lowStock.length === 0 && (
              <p className="text-charcoal-700">Aucune alerte pour le moment.</p>
            )}
            {outOfStock.map((p) => (
              <div key={p.id} className="flex justify-between">
                <span className="truncate">{p.name_fr}</span>
                <span className="font-semibold text-red-500">Épuisé</span>
              </div>
            ))}
            {lowStock.map((p) => (
              <div key={p.id} className="flex justify-between">
                <span className="truncate">{p.name_fr}</span>
                <span className="font-semibold text-gold-400">Stock faible ({totalStock(p)})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 rounded-lg bg-gold-400/10 p-3 text-xs text-charcoal-700">
        Note : le « taux de conversion » et les « produits les plus consultés » nécessitent le suivi des vues
        (table <code>product_views</code>, déjà incluse dans le schéma SQL) et davantage d'historique de
        commandes pour être significatifs — ils apparaîtront ici automatiquement une fois Supabase connecté
        et le trafic réel accumulé.
      </p>
    </div>
  );
}

function StatusRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-charcoal-700">
        <span className={`h-2 w-2 rounded-full ${color}`} /> {label}
      </span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
