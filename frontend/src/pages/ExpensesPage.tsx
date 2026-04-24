import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Receipt, Search, Filter, Plus, ChevronUp, ChevronDown, 
  MoreVertical, Edit2, Trash2, Calendar, Tag, CreditCard,
  ArrowUpDown
} from 'lucide-react';
import '../dashboard.css';

// Mock Data
const MOCK_EXPENSES = [
  { id: 1, date: '2024-04-24', category: 'Food', description: 'Gourmet Dinner at Taj', amount: 4500 },
  { id: 2, date: '2024-04-23', category: 'Transport', description: 'Uber to Office', amount: 350 },
  { id: 3, date: '2024-04-22', category: 'Rent', description: 'Monthly Apartment Rent', amount: 25000 },
  { id: 4, date: '2024-04-21', category: 'Shopping', description: 'Nike Air Max Sneakers', amount: 8900 },
  { id: 5, date: '2024-04-20', category: 'Health', description: 'Apollo Pharmacy Meds', amount: 1200 },
  { id: 6, date: '2024-04-19', category: 'Entertainment', description: 'Netflix Subscription', amount: 649 },
  { id: 7, date: '2024-04-18', category: 'Utilities', description: 'Electricity Bill', amount: 3200 },
  { id: 8, date: '2024-04-17', category: 'Food', description: 'Swiggy Delivery', amount: 850 },
  { id: 9, date: '2024-04-16', category: 'Transport', description: 'Petrol Refill', amount: 2000 },
  { id: 10, date: '2024-04-15', category: 'Other', description: 'Gym Membership', amount: 1500 },
];

const CATEGORIES = ['All', 'Food', 'Rent', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Utilities', 'Other'];

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

export default function ExpensesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  // Sorting Handler
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtered and Sorted Expenses
  const processedExpenses = useMemo(() => {
    let filtered = MOCK_EXPENSES.filter(exp => {
      const matchesSearch = exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exp.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || exp.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, activeCategory, sortConfig]);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Food': return { bg: 'rgba(244, 63, 94, 0.1)', text: '#fb7185' };
      case 'Rent': return { bg: 'rgba(124, 58, 237, 0.1)', text: '#a78bfa' };
      case 'Transport': return { bg: 'rgba(59, 130, 246, 0.1)', text: '#60a5fa' };
      case 'Shopping': return { bg: 'rgba(16, 185, 129, 0.1)', text: '#34d399' };
      case 'Health': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#fbbf24' };
      case 'Entertainment': return { bg: 'rgba(236, 72, 153, 0.1)', text: '#f472b6' };
      case 'Utilities': return { bg: 'rgba(6, 182, 212, 0.1)', text: '#22d3ee' };
      default: return { bg: 'rgba(107, 114, 128, 0.1)', text: '#9ca3af' };
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, letterSpacing: '-1px' }}>
            Expense <span style={{ color: '#a78bfa' }}>Tracker</span>
          </h1>
          <p style={{ margin: '8px 0 0', color: '#6b7280', fontWeight: 600, fontSize: '15px' }}>
            You have {MOCK_EXPENSES.length} total transactions this month.
          </p>
        </div>
        
        <button 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: '#7c3aed', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '16px', fontWeight: 800,
            fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)'
          }}
        >
          <Plus size={20} strokeWidth={3} />
          <span>New Expense</span>
        </button>
      </div>

      {/* Filters Section */}
      <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="search-box" style={{ maxWidth: '100%' }}>
          <Search size={20} color="#6b7280" />
          <input 
            type="text" 
            placeholder="Search by description or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`chip-filter ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('date')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} />
                  Date
                  {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th onClick={() => handleSort('category')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={14} />
                  Category
                  {sortConfig?.key === 'category' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th onClick={() => handleSort('description')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Description
                  {sortConfig?.key === 'description' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th onClick={() => handleSort('amount')} style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                  <CreditCard size={14} />
                  Amount
                  {sortConfig?.key === 'amount' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {processedExpenses.length > 0 ? (
              processedExpenses.map((exp) => {
                const colors = getCategoryColor(exp.category);
                return (
                  <tr key={exp.id}>
                    <td style={{ color: '#9ca3af', fontWeight: 600 }}>{new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <span className="chip" style={{ background: colors.bg, color: colors.text }}>
                        {exp.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{exp.description}</td>
                    <td style={{ textAlign: 'right', fontWeight: 900, fontSize: '16px', color: '#f3f4f6' }}>
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button className="action-btn" title="Edit Expense">
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete" title="Delete Expense">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <Receipt size={48} opacity={0.2} />
                    <p style={{ margin: 0, fontWeight: 600 }}>No expenses found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
