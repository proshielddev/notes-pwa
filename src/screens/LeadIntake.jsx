import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button, FormInput } from '../components/ui';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const INITIAL = {
  customerName: '', phone: '', email: '', contactMethod: '',
  moveDate: '', flexibleDate: '', source: '',
  pickupAddress: '', dropoffAddress: '',
  moveSize: '', buildingType: '', pickupFloor: '', dropoffFloor: '', elevator: '',
  packingNeeded: '', heavyItems: '', heavyItemNotes: '', longCarryNotes: '',
  depositRequired: 'Yes', estimateConfidence: '', internalNotes: '',
  status: 'New Lead', estimateTotal: 0,
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
    <div style={{
      fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase',
      letterSpacing: '0.08em', color: 'var(--color-accent)',
      marginBottom: 'var(--spacing-md)', paddingBottom: '0.5rem',
      borderBottom: '2px solid var(--color-accent)',
    }}>{title}</div>
    {children}
  </div>
);

export default function LeadIntake() {
  const { addLead } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [saved, setSaved] = useState(false);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    addLead(form);
    setSaved(true);
    setTimeout(() => navigate('/leads'), 1200);
  };

  if (saved) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
      <CheckCircle size={56} style={{ color: 'var(--color-success)' }} />
      <h2 style={{ marginBottom: 0 }}>Lead Saved!</h2>
      <p className="text-muted">Redirecting to Leads…</p>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text-mutated)' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 0 }}>New Lead Intake</h1>
      </div>

      <form onSubmit={handleSubmit}>

        <Section title="Contact Info">
          <FormInput label="Customer Name" value={form.customerName} onChange={set('customerName')} placeholder="Full name" required />
          <FormInput label="Phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="(419) 555-0000" required />
          <FormInput label="Email" type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" />
          <FormInput label="How did they contact us?" type="select" value={form.contactMethod} onChange={set('contactMethod')}
            options={['Phone', 'Email', 'Text', 'Website', 'Facebook', 'Referral']} required />
          <FormInput label="How did they hear about us?" type="select" value={form.source} onChange={set('source')}
            options={['Website', 'Referral', 'Phone', 'Facebook', 'Google', 'Nextdoor', 'Other']} />
        </Section>

        <Section title="Move Details">
          <FormInput label="Move Date" type="date" value={form.moveDate} onChange={set('moveDate')} required />
          <FormInput label="Flexible Date?" type="select" value={form.flexibleDate} onChange={set('flexibleDate')} options={['Yes', 'No']} />
          <FormInput label="Pickup Address" value={form.pickupAddress} onChange={set('pickupAddress')} placeholder="Full street address" required />
          <FormInput label="Drop-off Address" value={form.dropoffAddress} onChange={set('dropoffAddress')} placeholder="Full street address" required />
          <FormInput label="Move Size" type="select" value={form.moveSize} onChange={set('moveSize')}
            options={['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4+ Bedroom', 'Office', 'Other']} required />
          <FormInput label="Building Type" type="select" value={form.buildingType} onChange={set('buildingType')}
            options={['House', 'Apartment', 'Condo', 'Storage Unit', 'Office', 'Other']} />
        </Section>

        <Section title="Site Conditions">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 var(--spacing-md)' }}>
            <FormInput label="Pickup Floor" type="select" value={form.pickupFloor} onChange={set('pickupFloor')} options={['1','2','3','4','5','Basement']} />
            <FormInput label="Drop-off Floor" type="select" value={form.dropoffFloor} onChange={set('dropoffFloor')} options={['1','2','3','4','5','Basement']} />
          </div>
          <FormInput label="Elevator Available?" type="select" value={form.elevator} onChange={set('elevator')} options={['Yes', 'No']} />
          <FormInput label="Packing Needed?" type="select" value={form.packingNeeded} onChange={set('packingNeeded')} options={['Yes', 'No', 'Partial']} />
        </Section>

        <Section title="Special Items & Flags">
          <FormInput label="Heavy/Specialty Items?" type="select" value={form.heavyItems} onChange={set('heavyItems')} options={['Yes', 'No']} />
          {form.heavyItems === 'Yes' && (
            <FormInput label="Describe Heavy Items" value={form.heavyItemNotes} onChange={set('heavyItemNotes')} placeholder="Piano, pool table, safe…" />
          )}
          <FormInput label="Long Carry / Parking Notes" type="textarea" value={form.longCarryNotes} onChange={set('longCarryNotes')} placeholder="Long driveway, no street parking…" />
          <FormInput label="Internal Notes" type="textarea" value={form.internalNotes} onChange={set('internalNotes')} placeholder="Anything the crew should know…" />
          <FormInput label="Estimate Confidence" type="select" value={form.estimateConfidence} onChange={set('estimateConfidence')} options={['High', 'Medium', 'Low']} />
        </Section>

        <Button type="submit" fullWidth>Save Lead & Continue</Button>
        <div style={{ height: '2rem' }} />
      </form>
    </div>
  );
}
