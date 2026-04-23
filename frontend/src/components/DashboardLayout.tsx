import React from 'react';
import Sidebar from './Sidebar';
import { Bell, Search, Filter } from 'lucide-react';
import '../dashboard.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="dashboard-root">
      <Sidebar />
      
      <div className="main-wrapper">
        <header className="header">
          <div className="search-box">
            <Search size={18} color="#6b7280" />
            <input 
              type="text" 
              placeholder="Search transactions, insights, or files..." 
              aria-label="Search transactions and insights"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              aria-label="Filter transactions"
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '10px 18px', borderRadius: '14px', color: '#9ca3af',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
            
            <button 
              aria-label="View notifications"
              style={{ 
                background: 'transparent', border: 'none', color: '#6b7280', 
                cursor: 'pointer', position: 'relative' 
              }}
            >
              <Bell size={22} />
              <span style={{ 
                position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', 
                background: '#f43f5e', borderRadius: '50%', border: '2px solid #030712' 
              }}></span>
            </button>
          </div>
        </header>

        <main className="content-scroll">
          <div className="content-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
