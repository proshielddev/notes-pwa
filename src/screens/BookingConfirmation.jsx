import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card, Button, FormInput } from '../components/ui';
import { ArrowLeft, CheckCircle, DollarSign } from 'lucide-react';

export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, updateLeadStatus, addJob } = useAppContext();
  const lead = leads.find(l => l.id === id) || leads[0];

  const [depositMethod, setDepositMethod] = useState('Cash');
  const [depositNote, setDepositNote] = useState('');
  const [crew, setCrew] = useState('Dave, Marcus');
  const [backupNote, setBackupNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const depositAmount = Math.round((lead?.estimateTotal || 0) * 0.25);
  const balance = (lead?.estimateTotal || 0) - depositAmount;

  const handleConfirm = () => {
    const newJob = {
      id: `J-${Math.floor(Math.random() * 9000) + 1000}`,
      leadId: lead.id,
      date: lead.moveDate,
      customerName: lead.customerName,
      pickupAddress: lead.pickupAddress,
      dropoffAddress: lead.dropoffAddress,
      moveSize: lead.moveSize,
      status: 'Scheduled',
      crew: crew.split(',').map(c => c.trim()),
      backupNote,
      estimateTotal: lead.estimateTotal,
      depositPaid: depositAmount,
      balance,
    };
    addJob(newJob);
    updateLeadStatus(lead.id, 'Booked');
    setConfirmed(true);
    setTimeout(() => navigate('/jobs'), 1500);
  };

  if (confirmed) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
      <CheckCircle size={56} style={{ color: 'var(--color-success)' }} />
      <h2 style={{ marginBottom: 0 }}>Booked!</h2>
      <p className="text-muted">Job added to schedule</p>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text-mutated)' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 0 }}>Booking Confirmation</h1>
          <p className="text-muted text-sm">{lead?.customerName} · {lead?.id}</p>
        </div>
      </div>

      {/* Summary */}
      <Card>
        <div style={{ fontWeight: '700', marginBottom: '0.75rem', color: 'var(--color-accent)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Move Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem', fontSize: '0.875rem' }}>
          <div><span className="text-muted">Customer: </span><strong>{lead?.customerName}</strong></div>
          <div><span className="text-muted">Date: </span><strong>{lead?.moveDate}</strong></div>
          <div><span className="text-muted">Size: </span><strong>{lead?.moveSize}</strong></div>
          <div><span className="text-muted">Phone: </span><strong>{lead?.phone}</strong></div>
          <div style={{ gridColumn: '1/-1' }}><span className="text-muted">From: </span><strong>{lead?.pickupAddress}</strong></div>
          <div style={{ gridColumn: '1/-1' }}><span className="text-muted">To: </span><strong>{lead?.dropoffAddress}</strong></div>
        </div>
      </Card>

      {/* Deposit */}
      <Card>
        <div style={{ fontWeight: '700', marginBottom: '1rem', color: 'var(--color-accent)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deposit Collection</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
          <div>
            <div className="text-muted text-sm">Deposit (25%)</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-success)' }}>${depositAmount.toLocaleString()}</div>
          </div>
          <DollarSign size={32} style={{ color: 'var(--color-success)', opacity: 0.4 }} />
        </div>
        <FormInput label="Payment Method" type="select" value={depositMethod} onChange={e => setDepositMethod(e.target.value)}
          options={['Cash', 'Venmo', 'Zelle', 'Check', 'Card', 'Other']} />
        <FormInput label="Deposit Note" value={depositNote} onChange={e => setDepositNote(e.target.value)} placeholder="Reference number, note…" />
        <div className="flex justify-between text-sm" style={{ marginTop: '0.5rem' }}>
          <span className="text-muted">Balance due on move day</span>
          <strong>${balance.toLocaleString()}</strong>
        </div>
      </Card>

      {/* Crew Assignment */}
      <Card>
        <div style={{ fontWeight: '700', marginBottom: '1rem', color: 'var(--color-accent)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Crew Assignment</div>
        <FormInput label="Crew Members (comma-separated)" value={crew} onChange={e => setCrew(e.target.value)} placeholder="Dave, Marcus, Luis" />
        <FormInput label="Backup / Contingency Note" value={backupNote} onChange={e => setBackupNote(e.target.value)} placeholder="Call Mike if anyone is delayed…" />
      </Card>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
        <Button variant="accent" fullWidth onClick={handleConfirm}>✓ Confirm Booking</Button>
      </div>
    </div>
  );
}
