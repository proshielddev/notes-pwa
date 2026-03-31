import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Screen Imports
import Dashboard from './screens/Dashboard';
import LeadsList from './screens/LeadsList';
import LeadIntake from './screens/LeadIntake';
import EstimateBuilder from './screens/EstimateBuilder';
import QuoteReview from './screens/QuoteReview';
import Pipeline from './screens/Pipeline';
import BookingConfirmation from './screens/BookingConfirmation';
import Schedule from './screens/Schedule';
import JobsList from './screens/JobsList';
import JobExecution from './screens/JobExecution';
import Closeout from './screens/Closeout';
import Payments from './screens/Payments';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<LeadsList />} />
        <Route path="leads/new" element={<LeadIntake />} />
        <Route path="leads/:id/estimate" element={<EstimateBuilder />} />
        <Route path="leads/:id/quote" element={<QuoteReview />} />
        <Route path="leads/:id/book" element={<BookingConfirmation />} />
        
        <Route path="pipeline" element={<Pipeline />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="jobs" element={<JobsList />} />
        <Route path="jobs/:id/execute" element={<JobExecution />} />
        <Route path="jobs/:id/closeout" element={<Closeout />} />
        <Route path="payments" element={<Payments />} />
      </Route>
    </Routes>
  );
}
