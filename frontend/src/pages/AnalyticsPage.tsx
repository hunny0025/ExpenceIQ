import DashboardLayout from '../components/DashboardLayout';
import { PieChart } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-10 text-center">
        <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-400 mx-auto mb-6">
          <PieChart size={40} />
        </div>
        <h1 className="text-3xl font-black text-white">Analytics</h1>
        <p className="text-gray-500 mt-2">Detailed insights and spending reports. (Task 08)</p>
      </div>
    </DashboardLayout>
  );
}
