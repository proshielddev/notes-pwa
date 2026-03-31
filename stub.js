const fs = require('fs');
const files = [
  'QuoteReview.jsx', 'Pipeline.jsx', 'BookingConfirmation.jsx',
  'Schedule.jsx', 'JobsList.jsx', 'JobExecution.jsx',
  'Closeout.jsx', 'Payments.jsx'
];
files.forEach(f => {
  const name = f.split('.')[0];
  fs.writeFileSync(`src/screens/${f}`, `import React from 'react';\nexport default function ${name}() { return <div className="p-4"><h1>${name}</h1></div>; }`);
});
