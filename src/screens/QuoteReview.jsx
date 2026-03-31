import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card, Button, StatusChip } from '../components/ui';
import { ArrowLeft, Share2, CheckCircle, Phone, Mail } from 'lucide-react';

export default function QuoteReview() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { leads, updateLeadStatus } = useAppContext();
  const lead = leads.find(l => l.id === id) || leads[0];

  const total = state?.total ?? lead?.estimateTotal ?? 0;
  const depositAmount = state?.depositAmount ?? Math.round(total * 0.25);
  const balance = state?.balance ?? (total - depositAmount);

  const [sent, setSent] = useState(false);

  const handleSend = () => {
    updateLeadStatus(lead.id, 'Quote Sent');
    setSent(true);
    setTimeout(() => navigate('/leads'), 1400);
  };

  if (sent) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
      <CheckCircle size={56} style={{ color: 'var(--color-success)' }} />
      <h2 style={{ marginBottom: 0 }}>Quote Sent!</h2>
      <p className="text-muted">Status updated to "Quote Sent"</p>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text-mutated)' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 0 }}>Quote Review</h1>
          <p className="text-muted text-sm">Ready to share with customer</p>
        </div>
      </div>

      {/* Quote Preview Card */}
      <div style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.25rem' }}>Murrey's Movers</div>
            <div style={{ opacity: 0.65, fontSize: '0.8rem' }}>Professional Moving Services</div>
          </div>
          <div style={{ background: 'var(--color-accent)', borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: '700' }}>QUOTE</div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ opacity: 0.65, fontSize: '0.8rem', marginBottom: '0.2rem' }}>Prepared for</div>
          <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{lead?.customerName}</div>
          <div style={{ opacity: 0.65, fontSize: '0.85rem' }}>{lead?.phone}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          <div><div style={{ opacity: 0.65 }}>Move Date</div><div style={{ fontWeight: '600' }}>{lead?.moveDate}</div></div>
          <div><div style={{ opacity: 0.65 }}>Move Size</div><div style={{ fontWeight: '600' }}>{lead?.moveSize}</div></div>
          <div><div style={{ opacity: 0.65 }}>From</div><div style={{ fontWeight: '600' }}>{lead?.pickupAddress?.split(',')[0]}</div></div>
          <div><div style={{ opacity: 0.65 }}>To</div><div style={{ fontWeight: '600' }}>{lead?.dropoffAddress?.split(',')[0]}</div></div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', opacity: 0.75, fontSize: '0.875rem' }}>
            <span>Deposit Required</span><span>${depositAmount.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', opacity: 0.75, fontSize: '0.875rem' }}>
            <span>Balance on Move Day</span><span>${balance.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.5rem', marginTop: '0.75rem' }}>
            <span>Total</span><span style={{ color: 'var(--color-accent)' }}>${total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Customer Contact */}
      <Card>
        <div style={{ fontWeight: '700', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Send via</div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }}>
            <Phone size={16} style={{ color: 'var(--color-primary)' }} /> Call
          </button>
          <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }}>
            <Mail size={16} style={{ color: 'var(--color-primary)' }} /> Email
          </button>
          <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }}>
            <Share2 size={16} style={{ color: 'var(--color-primary)' }} /> Share
          </button>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <Button variant="secondary" onClick={() => navigate(-1)}>Edit</Button>
        <Button variant="accent" fullWidth onClick={handleSend}>Mark as Sent</Button>
      </div>
    </div>
  );
}
