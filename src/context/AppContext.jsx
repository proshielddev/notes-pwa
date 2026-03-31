import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Dummy Data for Leads & Pipeline
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
      estimateTotal: 1250.00
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
      estimateTotal: 450.00
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
      depositPaid: 500.00
    }
  ]);

  const [jobs, setJobs] = useState([
    {
      id: 'J-2001',
      leadId: 'L-1003',
      date: '2026-04-05',
      customerName: 'Elena Gilbert',
      status: 'Scheduled',
      crew: ['Dave', 'Marcus', 'Luis'],
      backupNote: 'Call Mike if crew is delayed',
      estimateTotal: 2100.00,
      depositPaid: 500.00,
      balance: 1600.00
    }
  ]);

  // Methods
  const addLead = (newLead) => {
    setLeads([{ ...newLead, id: `L-${Math.floor(Math.random() * 9000) + 1000}` }, ...leads]);
  };

  const updateLeadStatus = (id, newStatus) => {
    setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
  };
  
  const addJob = (newJob) => {
    setJobs([...jobs, newJob]);
  };

  const updateJob = (id, updates) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, ...updates } : job));
  };

  return (
    <AppContext.Provider value={{ leads, jobs, addLead, updateLeadStatus, addJob, updateJob }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
