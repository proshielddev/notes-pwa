import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui';
import { DollarSign, TrendingUp, CheckCircle, Clock, ChevronRight } from 'lucide-react';

export default function Payments() {
  const { jobs, leads } = useAppContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState('outstanding');

  const completed = jobs.filter(j => j.status === 'Completed');
  const outstanding = jobs.filter(j => j.status !== 'Completed' && (j.balance > 0 || j.depositPaid > 0));

  const totalCollected = completed.reduce((s, j) => s + (j.depositPaid || 0) + (j.finalBalance !== undefined ? 0 : (j.estimateTotal || 0) - (j.depositPaid || 0)), 0);
  const totalDeposits = jobs.reduce((s, j) => s + (j.depositPaid || 0), 0);
  const totalOutstanding = outstanding.reduce((s, j) => s + (j.balance || 0), 0);

  const TabBtn = ({ value, label }) => (
    <button
      onClick={() => setTab(value)}
      style={{
        flex: 1, padding: '0.6rem', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer',
        border: 'none', borderBottom: tab === value ? '2px solid var(--color-accent)' : '2px solid transparent',
        backgroundColor: 'transparent', color: tab === value ? 'var(--color-accent)' : 'var(--color-text-mutated)',
        transition: 'all 0.2s',
      }}
    >{label}</button>
  );

  const displayJobs = tab === 'outstanding' ? outstanding : completed;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.15rem' }}>Payments</h1>
      <p className="text-muted text-sm" style={{ marginBottom: 'var(--spacing-lg)' }}>Track deposits and balances</p>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', opacity: 0.7, fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
            <DollarSign size={12} /> Deposits In
          </div>
          <div style={{ fontWeight: '800', fontSize: '1.4rem' }}>${totalDeposits.toLocaleString()}</div>
        </div>
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: 'var(--color-text-mutated)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
            <Clock size={12} /> Outstanding
          </div>
          <div style={{ fontWeight: '800', fontSize: '1.4rem', color: outstanding.length > 0 ? 'var(--color-danger)' : 'var(--color-text)' }}>${totalOutstanding.toLocaleString()}</div>
        </div>
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: 'var(--color-text-mutated)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
            <TrendingUp size={12} /> Jobs Done
          </div>
          <div style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--color-success)' }}>{completed.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--spacing-md)' }}>
        <TabBtn value="outstanding" label={`Outstanding (${outstanding.length})`} />
        <TabBtn value="completed" label={`Completed (${completed.length})`} />
      </div>

      {/* Job Payment Rows */}
      {displayJobs.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-mutated)' }}>
            {tab === 'outstanding' ? 'No outstanding balances 🎉' : 'No completed jobs yet'}
          </div>
        </Card>
      ) : displayJobs.map(job => {
        const isComplete = job.status === 'Completed';
        return (
          <Card key={job.id} onClick={() => navigate(`/jobs/${job.id}/closeout`)}>
            <div className="flex items-start justify-between" style={{ gap: '0.75rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  {isComplete
                    ? <CheckCircle size={14} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                    : <Clock size={14} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />}
                  <span style={{ fontWeight: '700' }}>{job.customerName}</span>
                  <span className="text-xs text-muted">{job.id}</span>
                </div>
                <div className="text-sm text-muted" style={{ marginBottom: '0.5rem' }}>📅 {job.date}</div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                  <div>
                    <span className="text-muted">Deposit: </span>
                    <span style={{ fontWeight: '600', color: 'var(--color-success)' }}>${(job.depositPaid || 0).toLocaleString()}</span>
                  </div>
                  {!isComplete && (
                    <div>
                      <span className="text-muted">Balance: </span>
                      <span style={{ fontWeight: '600', color: 'var(--color-danger)' }}>${(job.balance || 0).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--color-primary)' }}>${(job.estimateTotal || 0).toLocaleString()}</div>
                <div className="text-xs text-muted">Total</div>
                <ChevronRight size={16} style={{ color: 'var(--color-text-mutated)', marginTop: '0.25rem' }} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
