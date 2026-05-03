import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard.jsx';
import EquipmentList from '../pages/EquipmentList.jsx';
import AddEquipment from '../pages/AddEquipment.jsx';
import IssueEquipment from '../pages/IssueEquipment.jsx';
import ReturnEquipment from '../pages/ReturnEquipment.jsx';
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import PublicRoute from "../routes/PublicRoute.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/equipment" element={
        <ProtectedRoute>
          <EquipmentList />
        </ProtectedRoute>
      } />
      <Route path="/equipment/add" element={<AddEquipment />} />
      <Route path="/lending/issue" element={<IssueEquipment />} />
      <Route path="/lending/return" element={<ReturnEquipment />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
