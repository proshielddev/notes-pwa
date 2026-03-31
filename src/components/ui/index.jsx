import React from 'react';

export const Card = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
    style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)', marginBottom: 'var(--spacing-md)' }}
  >
    {children}
  </div>
);

export const Button = ({ children, variant = 'primary', onClick, fullWidth, className = '', type = 'button' }) => {
  const baseStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: 'var(--radius-sm)',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    width: fullWidth ? '100%' : 'auto',
    textAlign: 'center',
    transition: 'background-color 0.2s'
  };

  const variants = {
    primary: { backgroundColor: 'var(--color-primary)', color: 'white' },
    secondary: { backgroundColor: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' },
    accent: { backgroundColor: 'var(--color-accent)', color: 'white' },
    danger: { backgroundColor: 'var(--color-danger)', color: 'white' },
  };

  return (
    <button type={type} onClick={onClick} className={className} style={{ ...baseStyle, ...variants[variant] }}>
      {children}
    </button>
  );
};

export const StatusChip = ({ status }) => {
  const getStyle = () => {
    switch(status) {
      case 'New Lead': return { bg: '#DBEAFE', color: '#1D4ED8' };
      case 'Estimating': return { bg: '#FEF3C7', color: '#B45309' };
      case 'Quote Sent': return { bg: '#E0E7FF', color: '#4338CA' };
      case 'Follow-up Needed': return { bg: '#FFEDD5', color: '#C2410C' };
      case 'Awaiting Deposit': return { bg: '#FEE2E2', color: '#B91C1C' };
      case 'Booked': return { bg: '#D1FAE5', color: '#047857' };
      case 'Scheduled': return { bg: '#D1FAE5', color: '#047857' };
      case 'Executing': return { bg: '#FEF3C7', color: '#B45309' };
      case 'Paused': return { bg: '#FEE2E2', color: '#B91C1C' };
      case 'Completed': return { bg: '#F3F4F6', color: '#374151' };
      default: return { bg: '#F3F4F6', color: '#4B5563' };
    }
  };

  const style = getStyle();

  return (
    <span style={{ 
      backgroundColor: style.bg, 
      color: style.color, 
      padding: '0.25rem 0.75rem', 
      borderRadius: 'var(--radius-full)', 
      fontSize: '0.75rem', 
      fontWeight: '600',
      display: 'inline-block'
    }}>
      {status}
    </span>
  );
};

export const FormInput = ({ label, type = 'text', value, onChange, placeholder, required, options }) => {
  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    marginTop: '0.25rem',
    fontFamily: 'var(--font-family)',
    fontSize: '1rem'
  };

  return (
    <div style={{ marginBottom: 'var(--spacing-md)' }}>
      <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text)' }}>
        {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
      </label>
      {type === 'select' ? (
        <select value={value} onChange={onChange} style={inputStyle} required={required}>
          <option value="" disabled>Select {label}</option>
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} style={{ ...inputStyle, minHeight: '80px' }} required={required} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={inputStyle} required={required} />
      )}
    </div>
  );
};
