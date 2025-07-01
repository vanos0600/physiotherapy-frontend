
#!/bin/bash

# Crear carpetas
mkdir -p src/components src/pages

# Crear src/api.js
cat > src/api.js << 'EOF'
const API_BASE = 'http://localhost:5000/api';

export async function fetchPatients() {
  const res = await fetch(`${API_BASE}/patients`);
  if (!res.ok) throw new Error('Error fetching patients');
  return res.json();
}
EOF

# Crear src/components/PatientList.jsx
cat > src/components/PatientList.jsx << 'EOF'
import React, { useEffect, useState } from 'react';
import { fetchPatients } from '../api';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients()
      .then(data => setPatients(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Patients</h2>
      <ul>
        {patients.map(p => (
          <li key={p._id}>{p.name} - {p.email}</li>
        ))}
      </ul>
    </div>
  );
}
EOF

# Crear src/pages/Patients.jsx
cat > src/pages/Patients.jsx << 'EOF'
import React from 'react';
import PatientList from '../components/PatientList';

export default function Patients() {
  return (
    <div>
      <h1>Patients Page</h1>
      <PatientList />
    </div>
  );
}
EOF

# Crear src/pages/Home.jsx
cat > src/pages/Home.jsx << 'EOF'
export default function Home() {
  return <h1>Welcome to Fisioterapia App</h1>;
}
EOF

# Crear src/pages/Login.jsx
cat > src/pages/Login.jsx << 'EOF'
export default function Login() {
  return <h1>Login Page (to be implemented)</h1>;
}
EOF

# Crear src/App.jsx
cat > src/App.jsx << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Patients from './pages/Patients';
import Home from './pages/Home';
import Login from './pages/Login';

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/patients">Patients</Link> | <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
EOF

echo "Archivos creados correctamente."
