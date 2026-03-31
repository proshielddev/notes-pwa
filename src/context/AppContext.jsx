import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {

  // ── LEADS ──────────────────────────────────────────────────────────────────
  const [leads, setLeads] = useState([
    {
      id: 'L-1001',
      customerName: 'Sarah Jenkins',
      phone: '(419) 555-0198',
      email: 'sarah.j@example.com',
      contactMethod: 'Phone',
      moveDate: '2026-04-12',
      pickupAddress: '124 Main St, Bowling Green, OH',
      dropoffAddress: '890 Oakwood Ave, Toledo, OH',
      moveSize: '2 Bedroom',
      buildingType: 'Apartment',
      pickupFloor: '2',
      dropoffFloor: '1',
      elevator: 'No',
      packingNeeded: 'Yes',
      heavyItems: 'Yes',
      heavyItemNotes: 'Upright Piano',
      longCarryNotes: 'Long driveway at drop-off',
      internalNotes: 'First-time homebuyer, nervous about the piano.',
      estimateConfidence: 'High',
      flexibleDate: 'No',
      depositRequired: 'Yes',
      source: 'Website',
      status: 'Awaiting Deposit',
      estimateTotal: 1250.00,
    },
    {
      id: 'L-1002',
      customerName: 'Mike Ross',
      phone: '(419) 555-0211',
      email: 'mross@example.com',
      contactMethod: 'Email',
      moveDate: '2026-04-18',
      pickupAddress: '45 Student Ln, Bowling Green, OH',
      dropoffAddress: '48 Student Ln, Bowling Green, OH',
      moveSize: '1 Bedroom',
      buildingType: 'Apartment',
      pickupFloor: '1',
      dropoffFloor: '3',
      elevator: 'Yes',
      packingNeeded: 'No',
      heavyItems: 'No',
      heavyItemNotes: '',
      longCarryNotes: '',
      internalNotes: 'BGSU student moving to new dorm/apt.',
      estimateConfidence: 'Medium',
      flexibleDate: 'Yes',
      depositRequired: 'Yes',
      source: 'Referral',
      status: 'Estimating',
      estimateTotal: 450.00,
    },
    {
      id: 'L-1003',
      customerName: 'Elena Gilbert',
      phone: '(419) 555-0344',
      email: 'egilbert@example.com',
      contactMethod: 'Phone',
      moveDate: '2026-04-05',
      pickupAddress: '1092 Suburbia Dr, Sylvania, OH',
      dropoffAddress: '782 Downtown Blvd, Toledo, OH',
      moveSize: '3 Bedroom',
      buildingType: 'House',
      pickupFloor: '1',
      dropoffFloor: '4',
      elevator: 'Yes',
      packingNeeded: 'Partial',
      heavyItems: 'Yes',
      heavyItemNotes: 'Pool Table',
      longCarryNotes: '',
      internalNotes: '',
      estimateConfidence: 'Low',
      flexibleDate: 'No',
      depositRequired: 'Yes',
      source: 'Phone',
      status: 'Booked',
      estimateTotal: 2100.00,
      depositPaid: 500.00,
    },
  ]);

  // ── STANDALONE ESTIMATES ───────────────────────────────────────────────────
  const [estimates, setEstimates] = useState([
    {
      id: 'E-3001',
      customerName: 'James Carter',
      phone: '(419) 555-0477',
      pickupAddress: '320 Ridge Rd, Perrysburg, OH',
      dropoffAddress: '1100 Monroe St, Toledo, OH',
      moveDate: '2026-04-22',
      moveSize: '2 Bedroom',
      buildingType: 'House',
      pickupFloor: '1',
      dropoffFloor: '2',
      elevator: 'No',
      numMovers: 2,
      hourlyRate: 125,
      estimatedHours: 5,
      distanceMiles: 18.4,
      distanceFeeRate: 2.50,
      distanceFee: 46,
      heavyItemFee: 0,
      packingFee: 0,
      longCarryFee: 0,
      disassemblyFee: 0,
      discount: 0,
      estimateType: 'Non-binding',
      estimateConfidence: 'High',
      estimateTotal: 1296,
      createdAt: '2026-03-30',
      status: 'Draft',
    },
    {
      id: 'E-3002',
      customerName: 'Priya Nair',
      phone: '(567) 555-0122',
      pickupAddress: '88 University Dr, Bowling Green, OH',
      dropoffAddress: '540 Collingwood Blvd, Toledo, OH',
      moveDate: '2026-05-01',
      moveSize: '1 Bedroom',
      buildingType: 'Apartment',
      pickupFloor: '3',
      dropoffFloor: '1',
      elevator: 'Yes',
      numMovers: 2,
      hourlyRate: 125,
      estimatedHours: 3,
      distanceMiles: 26.1,
      distanceFeeRate: 2.50,
      distanceFee: 65.25,
      heavyItemFee: 0,
      packingFee: 0,
      longCarryFee: 0,
      disassemblyFee: 0,
      discount: 0,
      estimateType: 'Binding',
      estimateConfidence: 'Medium',
      estimateTotal: 815.25,
      createdAt: '2026-03-31',
      status: 'Quote Sent',
    },
  ]);

  // ── JOBS ───────────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState([
    {
      id: 'J-2001',
      leadId: 'L-1003',
      date: '2026-04-05',
      customerName: 'Elena Gilbert',
      pickupAddress: '1092 Suburbia Dr, Sylvania, OH',
      dropoffAddress: '782 Downtown Blvd, Toledo, OH',
      moveSize: '3 Bedroom',
      status: 'Scheduled',
      crew: ['Dave', 'Marcus', 'Luis'],
      backupNote: 'Call Mike if crew is delayed',
      estimateTotal: 2100.00,
      depositPaid: 500.00,
      balance: 1600.00,
    },
  ]);

  // ── LEAD METHODS ───────────────────────────────────────────────────────────
  const addLead = (newLead) => {
    setLeads(prev => [{ ...newLead, id: `L-${Math.floor(Math.random() * 9000) + 1000}` }, ...prev]);
  };

  const updateLeadStatus = (id, newStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const updateLead = (id, updates) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  // ── ESTIMATE METHODS ───────────────────────────────────────────────────────
  const addEstimate = (estimate) => {
    const id = `E-${Math.floor(Math.random() * 9000) + 1000}`;
    setEstimates(prev => [{ ...estimate, id, createdAt: new Date().toISOString().split('T')[0] }, ...prev]);
    return id;
  };

  const updateEstimate = (id, updates) => {
    setEstimates(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  // ── JOB METHODS ───────────────────────────────────────────────────────────
  const addJob = (newJob) => {
    setJobs(prev => [...prev, newJob]);
  };

  const updateJob = (id, updates) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  };

  return (
    <AppContext.Provider value={{
      leads, addLead, updateLeadStatus, updateLead,
      estimates, addEstimate, updateEstimate,
      jobs, addJob, updateJob,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
