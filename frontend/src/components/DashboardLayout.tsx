/**
 * DashboardLayout — root layout shell for all authenticated pages.
 *
 * Composes the desktop {@link Sidebar}, {@link MobileNavigation},
 * a top header bar with search / filters / {@link NotificationBell},
 * and a scrollable content area.
 *
 * @example
 * ```tsx
 * <DashboardLayout>
 *   <DashboardPage />
 * </DashboardLayout>
 * ```
 */

import React from 'react';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import NotificationBell from './ui/NotificationBell';
import { Search, Filter } from 'lucide-react';
import '../dashboard.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="dashboard-root">
      <Sidebar />
      <MobileNavigation />

      <div className="main-wrapper">
        <header className="header">
          {/* Mobile hamburger is rendered by MobileNavigation (portal-free) */}

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
            
            <NotificationBell />
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
