import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, StatusChip, Button } from '../components/ui';
import { useAppContext } from '../context/AppContext';
import { Users, FileText, DollarSign, Calendar, AlertCircle, PlusCircle } from 'lucide-react';

export default function Dashboard() {
  const { leads, jobs } = useAppContext();
  const navigate = useNavigate();

  // Basic KPI calculations
  const newLeadsCount = leads.filter(l => l.status === 'New Lead' || l.status === 'Estimating').length;
  const awaitingDepositCount = leads.filter(l => l.status === 'Awaiting Deposit').length;
  const bookedJobsCount = jobs.length;
  const jobsAtRisk = jobs.filter(j => j.backupNote).length;
  
  const revenuePipeline = leads
    .filter(l => !['Lost', 'Booked', 'Completed'].includes(l.status))
    .reduce((sum, l) => sum + (l.estimateTotal || 0), 0);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Dashboard</h1>
          <p className="text-muted text-sm" style={{ marginBottom: 0 }}>Good Morning, Murrey's Movers</p>
        </div>
        <Button variant="accent" onClick={() => navigate('/leads/new')} className="flex items-center gap-2">
          <PlusCircle size={18} /> New Lead
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
        
        {/* KPI Cards */}
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-muted text-sm font-medium">Active Leads</p>
            <h3>{newLeadsCount}</h3>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#E0E7FF', borderRadius: 'var(--radius-full)', color: '#4338CA' }}>
            <Users size={24} />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-muted text-sm font-medium">Pending Deposits</p>
            <h3>{awaitingDepositCount}</h3>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-full)', color: '#B45309' }}>
            <FileText size={24} />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-muted text-sm font-medium">Revenue Pipeline</p>
            <h3>${revenuePipeline.toLocaleString()}</h3>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#D1FAE5', borderRadius: 'var(--radius-full)', color: '#047857' }}>
            <DollarSign size={24} />
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-xl)' }}>
        
        {/* Today's Schedule */}
        <div>
          <h3 className="flex items-center gap-2 text-primary" style={{ borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            <Calendar size={20} /> Today's Jobs
          </h3>
          {jobs.length === 0 ? (
            <p className="text-muted text-sm">No jobs scheduled for today.</p>
          ) : (
            jobs.map(job => (
              <Card key={job.id} onClick={() => navigate(`/jobs/${job.id}/execute`)}>
                <div className="flex justify-between items-start" style={{ marginBottom: '0.5rem' }}>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>{job.customerName}</h4>
                    <p className="text-muted text-xs" style={{ marginBottom: 0 }}>Crew: {job.crew.join(', ')}</p>
                  </div>
                  <StatusChip status={job.status} />
                </div>
                {job.backupNote && (
                  <div className="flex items-center gap-2" style={{ marginTop: '0.75rem', padding: '0.5rem', backgroundColor: '#FEE2E2', borderRadius: 'var(--radius-sm)', color: '#B91C1C', fontSize: '0.75rem', fontWeight: '500' }}>
                    <AlertCircle size={14} /> <span>Risk: {job.backupNote}</span>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Action Items */}
        <div>
          <h3 className="flex items-center gap-2 text-primary" style={{ borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Needs Attention
          </h3>
          <div className="flex flex-col gap-2">
             {leads.filter(l => l.status === 'Awaiting Deposit').map(lead => (
               <Card key={lead.id} onClick={() => navigate(`/leads/${lead.id}/book`)} style={{ padding: '0.75rem 1rem' }}>
                 <div className="flex justify-between items-center">
                   <div>
                     <p className="font-medium text-sm" style={{ marginBottom: 0 }}>{lead.customerName}</p>
                     <p className="text-muted text-xs" style={{ marginBottom: 0 }}>Awaiting Deposit: ${lead.estimateTotal * 0.2}</p>
                   </div>
                   <Button variant="secondary" className="text-xs" style={{ padding: '0.25rem 0.5rem' }}>
                     Process
                   </Button>
                 </div>
               </Card>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}
