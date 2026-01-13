import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<div>Login Page (coming soon)</div>} />
        <Route path="/dashboard" element={<div>Dashboard (coming soon)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
