fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ role: 'admin', email: 'admin@example.com', password: 'admin123' })
}).then(r => r.json().then(d => console.log(r.status, d))).catch(console.error);
