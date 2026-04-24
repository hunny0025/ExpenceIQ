import DashboardLayout from '../components/DashboardLayout';
import { Target } from 'lucide-react';

export default function BudgetPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-10 text-center">
        <div className="w-20 h-20 bg-emerald-600/10 rounded-3xl flex items-center justify-center text-emerald-400 mx-auto mb-6">
          <Target size={40} />
        </div>
        <h1 className="text-3xl font-black text-white">Budget</h1>
        <p className="text-gray-500 mt-2">Set limits and save more efficiently. (Task 07)</p>
      </div>
    </DashboardLayout>
  );
}
