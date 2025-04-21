import { useState, useEffect } from 'react'

interface HealthStatus {
  status: string;
  database?: string;
  features?: string[];
  mode?: string;
  message?: string;
}

function App() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({ status: 'loading...' });
  const [events, setEvents] = useState<any>(null);

  useEffect(() => {
    // Fetch API health data
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealthStatus(data))
      .catch(err => {
        console.error('Error fetching health status:', err);
        setHealthStatus({ status: 'error', message: err.message });
      });
      
    // Fetch events data
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => {
        console.error('Error fetching events:', err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Event Master Dashboard</h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Status</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(healthStatus, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Events Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(events, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default App