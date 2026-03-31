import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card, Button, FormInput } from '../components/ui';
import { ArrowLeft, CheckCircle, Star } from 'lucide-react';

export default function Closeout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJob } = useAppContext();
  const job = jobs.find(j => j.id === id) || jobs[0];

  const [finalHours, setFinalHours] = useState('4');
  const [additionalCharges, setAdditionalCharges] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentNote, setPaymentNote] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [damages, setDamages] = useState('');
  const [completed, setCompleted] = useState(false);

  const baseBalance = job?.balance || 0;
  const addl = parseFloat(additionalCharges) || 0;
  const finalBalance = Math.max(0, baseBalance + addl);

  const handleComplete = () => {
    updateJob(job.id, {
      status: 'Completed',
      finalHours: parseFloat(finalHours),
      additionalCharges: addl,
      finalBalance,
      paymentMethod,
      rating,
      review,
    });
    setCompleted(true);
    setTimeout(() => navigate('/payments'), 1500);
  };

  if (completed) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
      <CheckCircle size={56} style={{ color: 'var(--color-success)' }} />
      <h2 style={{ marginBottom: 0 }}>Job Complete! 🎉</h2>
      <p className="text-muted">Redirecting to Payments…</p>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text-mutated)' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 0 }}>Job Closeout</h1>
          <p className="text-muted text-sm">{job?.customerName} · {job?.id}</p>
        </div>
      </div>

      {/* Final Billing */}
      <Card>
        <div style={{ fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', marginBottom: '1rem' }}>Final Billing</div>
        <FormInput label="Actual Hours Worked" type="number" value={finalHours} onChange={e => setFinalHours(e.target.value)} placeholder="4" />
        <FormInput label="Additional Charges ($)" type="number" value={additionalCharges} onChange={e => setAdditionalCharges(e.target.value)} placeholder="0" />

        <div style={{ backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: '1rem', marginTop: '0.5rem' }}>
          <div className="flex justify-between text-sm" style={{ marginBottom: '0.4rem' }}>
            <span className="text-muted">Deposit Paid</span>
            <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>− ${job?.depositPaid?.toLocaleString()}</span>
          </div>
          {addl > 0 && (
            <div className="flex justify-between text-sm" style={{ marginBottom: '0.4rem' }}>
              <span className="text-muted">Additional Charges</span>
              <span>+ ${addl.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between" style={{ fontWeight: '800', fontSize: '1.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)', marginTop: '0.4rem' }}>
            <span>Balance Due</span>
            <span style={{ color: 'var(--color-primary)' }}>${finalBalance.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Payment Collection */}
      <Card>
        <div style={{ fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', marginBottom: '1rem' }}>Collect Payment</div>
        <FormInput label="Payment Method" type="select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
          options={['Cash', 'Venmo', 'Zelle', 'Check', 'Card', 'Other']} />
        <FormInput label="Payment Note / Reference" value={paymentNote} onChange={e => setPaymentNote(e.target.value)} placeholder="Venmo ref, check #, etc." />
      </Card>

      {/* Damage Report */}
      <Card>
        <div style={{ fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', marginBottom: '1rem' }}>Damage Report</div>
        <FormInput label="Any damage noted? (leave blank if none)" type="textarea" value={damages} onChange={e => setDamages(e.target.value)} placeholder="Describe any damage to customer property or items…" />
      </Card>

      {/* Customer Satisfaction */}
      <Card>
        <div style={{ fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', marginBottom: '1rem' }}>Customer Satisfaction</div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {[1, 2, 3, 4, 5].map(s => (
            <Star
              key={s}
              size={32}
              onClick={() => setRating(s)}
              onMouseEnter={() => setHoverRating(s)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                cursor: 'pointer',
                fill: s <= (hoverRating || rating) ? '#F59E0B' : 'none',
                color: s <= (hoverRating || rating) ? '#F59E0B' : 'var(--color-border)',
                transition: 'all 0.15s',
              }}
            />
          ))}
        </div>
        <FormInput label="Customer Review / Feedback" type="textarea" value={review} onChange={e => setReview(e.target.value)} placeholder="What did they say? Ask for a Google review!" />
      </Card>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
        <Button variant="accent" fullWidth onClick={handleComplete}>✓ Complete Job & Collect Payment</Button>
      </div>
    </div>
  );
}
