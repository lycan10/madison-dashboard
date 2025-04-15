
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './screens/dashboard/Dashboard';
import Login from './screens/login/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;
