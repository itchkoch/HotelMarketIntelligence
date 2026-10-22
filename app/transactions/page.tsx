import TransactionsTable from '@/components/TransactionsTable';
import { transactions } from '@/lib/data';

export const metadata = { title: 'Transactions — Hotel Intelligence' };

export default function TransactionsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">Hotel transactions</h1>
        <p className="text-sm text-gray-600">
          {transactions.length} hotel sales in Canada, the USA and Mexico. Rows marked “No source” have no article link on
          record and should be verified before use.
        </p>
      </div>
      <TransactionsTable rows={transactions} />
    </div>
  );
}
