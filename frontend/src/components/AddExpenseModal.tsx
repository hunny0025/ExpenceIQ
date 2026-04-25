import React, { useState } from 'react';
import Modal from './ui/Modal';
import { 
  IndianRupee, Tag, Calendar, AlignLeft, Upload, 
  AlertCircle, CheckCircle2, Loader2 
} from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: any) => void;
}

const CATEGORIES = ['Food', 'Rent', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Utilities', 'Other'];

export default function AddExpenseModal({ isOpen, onClose, onAdd }: AddExpenseModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onAdd({
        ...formData,
        id: Date.now(),
        amount: Number(formData.amount)
      });
      
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({
          amount: '',
          category: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
        });
      }, 1500);
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Amount Field */}
        <div className="form-group">
          <label style={labelStyle}>
            <IndianRupee size={16} /> Amount
          </label>
          <div style={inputWrapperStyle}>
            <input
              type="number"
              placeholder="0.00"
              style={inputStyle(!!errors.amount)}
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
            {errors.amount && <div style={errorStyle}><AlertCircle size={14} /> {errors.amount}</div>}
          </div>
        </div>

        {/* Category Field */}
        <div className="form-group">
          <label style={labelStyle}>
            <Tag size={16} /> Category
          </label>
          <div style={inputWrapperStyle}>
            <select
              style={inputStyle(!!errors.category)}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="" disabled>Select Category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <div style={errorStyle}><AlertCircle size={14} /> {errors.category}</div>}
          </div>
        </div>

        {/* Date Field */}
        <div className="form-group">
          <label style={labelStyle}>
            <Calendar size={16} /> Date
          </label>
          <div style={inputWrapperStyle}>
            <input
              type="date"
              style={inputStyle(!!errors.date)}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            {errors.date && <div style={errorStyle}><AlertCircle size={14} /> {errors.date}</div>}
          </div>
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label style={labelStyle}>
            <AlignLeft size={16} /> Description
          </label>
          <div style={inputWrapperStyle}>
            <textarea
              placeholder="What was this expense for?"
              style={{ ...inputStyle(!!errors.description), minHeight: '100px', resize: 'vertical' }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && <div style={errorStyle}><AlertCircle size={14} /> {errors.description}</div>}
          </div>
        </div>

        {/* Receipt Upload (UI Only) */}
        <div className="form-group">
          <label style={labelStyle}>
            <Upload size={16} /> Receipt (Optional)
          </label>
          <div 
            style={{
              border: '2px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.02)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#7c3aed'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          >
            <Upload size={24} color="#6b7280" style={{ marginBottom: '8px' }} />
            <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>Click or drag to upload receipt</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          style={{
            marginTop: '10px',
            padding: '16px',
            borderRadius: '16px',
            border: 'none',
            background: isSuccess ? '#10b981' : '#7c3aed',
            color: 'white',
            fontWeight: 800,
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.3s',
            boxShadow: isSuccess ? '0 8px 24px rgba(16, 185, 129, 0.3)' : '0 8px 24px rgba(124, 58, 237, 0.3)'
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Saving...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 size={20} />
              Expense Added!
            </>
          ) : (
            'Add Expense'
          )}
        </button>
      </form>
    </Modal>
  );
}

// Inline Styles
const labelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#d1d5db',
  fontSize: '14px',
  fontWeight: 600,
  marginBottom: '8px'
};

const inputWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: `1px solid ${hasError ? '#f43f5e' : 'rgba(255, 255, 255, 0.1)'}`,
  borderRadius: '12px',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
  transition: 'all 0.2s',
  boxSizing: 'border-box'
});

const errorStyle: React.CSSProperties = {
  color: '#f43f5e',
  fontSize: '12px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginTop: '4px'
};
