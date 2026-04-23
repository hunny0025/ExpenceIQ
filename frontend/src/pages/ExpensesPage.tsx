import DashboardLayout from '../components/DashboardLayout';
import { Receipt } from 'lucide-react';

export default function ExpensesPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-10 text-center">
        <div className="w-20 h-20 bg-violet-600/10 rounded-3xl flex items-center justify-center text-violet-400 mx-auto mb-6">
          <Receipt size={40} />
        </div>
        <h1 className="text-3xl font-black text-white">Expenses</h1>
        <p className="text-gray-500 mt-2">Manage and track your daily spending. (Task 06)</p>
      </div>
    </DashboardLayout>
  );
}
