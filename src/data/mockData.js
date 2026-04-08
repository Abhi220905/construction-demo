// Generators for Large Mock Data Sets
const generateSites = (count) => {
  const sites = [];
  const startLat = 22.0;
  const startLng = 72.0;
  
  for (let i = 1; i <= count; i++) {
    sites.push({
      id: i,
      name: `Construction Site ₹{i}`,
      lat: startLat + (Math.random() * 4 - 2), // random spread
      lng: startLng + (Math.random() * 4 - 2),
      status: Math.random() > 0.8 ? 'Delayed' : Math.random() > 0.9 ? 'Halted' : 'Active',
      progress: Math.floor(Math.random() * 100),
      budget: Math.floor(Math.random() * 5000000) + 100000,
      workersAssigned: Math.floor(Math.random() * 150) + 10,
    });
  }
  return sites;
};

const generateWorkers = (count) => {
  const workers = [];
  const roles = ['Engineer', 'Foreman', 'Welder', 'Electrician', 'Mason', 'Laborer'];
  
  for (let i = 1; i <= count; i++) {
    workers.push({
      id: i,
      name: `Worker ₹{i}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      siteId: Math.floor(Math.random() * 200) + 1,
      attendance: Math.floor(Math.random() * 20) + 80, // % attendance
      safetyScore: Math.floor(Math.random() * 40) + 60, // out of 100
      status: Math.random() > 0.1 ? 'On Site' : 'Leave',
    });
  }
  return workers;
};

const generateReports = (count) => {
  const reports = [];
  const types = ['Safety Incident', 'Progress Update', 'Material Shortage', 'Weather Delay', 'Inspection'];
  
  for (let i = 1; i <= count; i++) {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 30)); // past 30 days
    reports.push({
      id: i,
      title: `₹{types[Math.floor(Math.random() * types.length)]} on Site ₹{Math.floor(Math.random() * 200) + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      date: d.toISOString().split('T')[0],
      siteId: Math.floor(Math.random() * 200) + 1,
      severity: Math.random() > 0.8 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low',
      author: `User ₹{Math.floor(Math.random() * 50) + 1}`
    });
  }
  // Sort by date descending
  return reports.sort((a,b) => new Date(b.date) - new Date(a.date));
};

export const MOCK_SITES = generateSites(10);
export const MOCK_WORKERS = generateWorkers(80);
export const MOCK_REPORTS = generateReports(12);
