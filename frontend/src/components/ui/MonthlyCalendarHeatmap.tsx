import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './MonthlyCalendarHeatmap.css';

export interface HeatmapData {
  date: string | Date;
  amount: number;
}

export interface MonthlyCalendarHeatmapProps {
  data: HeatmapData[];
  year?: number;
  month?: number; // 1-indexed (1-12)
  className?: string;
}

export default function MonthlyCalendarHeatmap({
  data,
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1,
  className = ''
}: MonthlyCalendarHeatmapProps) {
  // Calculate start and end dates for the 1-month view
  // react-calendar-heatmap uses startDate and endDate exclusive/inclusive depending on the version
  // Typically startDate is exclusive, so we start one day before the month
  const startDate = new Date(year, month - 1, 0); 
  const endDate = new Date(year, month, 0); // Last day of the requested month

  // Extract amount bounds to map to intensity
  const amounts = data.map(d => d.amount).filter(a => a > 0);
  const maxAmount = amounts.length ? Math.max(...amounts) : 0;
  
  // Transform data to ensure dates are correctly matched by the library
  // react-calendar-heatmap expects date strings in 'YYYY-MM-DD' or Date objects
  const heatmapValues = data.map(item => ({
    date: item.date,
    count: item.amount // Store amount in count for internal usage
  }));

  const getClassForValue = (value: { date: Date | string, count: number } | null) => {
    if (!value || value.count === 0) {
      return 'color-empty'; // no spend -> white
    }
    
    // Map amount to color scale (1 to 3)
    // using a simple ratio if maxAmount > 0
    if (maxAmount === 0) return 'color-scale-1'; // fallback
    
    const ratio = value.count / maxAmount;
    
    if (ratio <= 0.33) return 'color-scale-1'; // low -> light blue
    if (ratio <= 0.66) return 'color-scale-2'; // medium -> blue
    return 'color-scale-3'; // high -> dark blue
  };

  const getTooltipDataAttrs = (value: { date: Date | string, count: number } | null) => {
    if (!value?.date) return null;
    
    const dateStr = typeof value.date === 'string' 
      ? value.date 
      : (value.date as Date).toISOString().split('T')[0];
      
    return {
      title: `${dateStr}: $${value.count.toFixed(2)}`
    } as any;
  };

  return (
    <div className={`monthly-heatmap-container ${className}`}>
      <div className="heatmap-header">
        <h3>Spending Heatmap</h3>
        <span className="heatmap-subtitle">
          {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
      </div>
      
      <div className="heatmap-wrapper">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={heatmapValues}
          classForValue={getClassForValue}
          showWeekdayLabels={true}
          tooltipDataAttrs={getTooltipDataAttrs}
        />
      </div>
      
      <div className="heatmap-legend">
        <span className="legend-label">Less</span>
        <div className="legend-squares">
          <div className="legend-square color-empty"></div>
          <div className="legend-square color-scale-1"></div>
          <div className="legend-square color-scale-2"></div>
          <div className="legend-square color-scale-3"></div>
        </div>
        <span className="legend-label">More</span>
      </div>
    </div>
  );
}
