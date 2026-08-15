import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import LandingPage from '../pages/Landing/LandingPage';
import RoleSelectionPage from '../pages/RoleSelection/RoleSelectionPage';
import DonorRegisterPage from '../pages/Auth/DonorRegisterPage';
import RecipientRegisterPage from '../pages/Auth/RecipientRegisterPage';
import LoginPage from '../pages/Auth/LoginPage';
import AdminLoginPage from '../pages/Auth/AdminLoginPage';
import TermsAndConditionsPage from '../pages/Terms/TermsAndConditionsPage';
import HelpPage from '../pages/Help/HelpPage';
import NotificationsPage from '../pages/Notifications/NotificationsPage';

// Donor Portal Pages
import DonorDashboard from '../pages/Donor/DonorDashboard';
import DonorProfile from '../pages/Donor/DonorProfile';
import DonationDetails from '../pages/Donor/DonationDetails';

// Recipient Portal Pages
import RecipientDashboard from '../pages/Recipient/RecipientDashboard';
import RecipientProfile from '../pages/Recipient/RecipientProfile';
import WaitingListRank from '../pages/Recipient/WaitingListRank';

// Admin Portal Pages
import AdminDashboard from '../pages/Admin/AdminDashboard';
import DonorManagement from '../pages/Admin/DonorManagement';
import RecipientManagement from '../pages/Admin/RecipientManagement';
import OrganManagement from '../pages/Admin/OrganManagement';
import MatchManagement from '../pages/Admin/MatchManagement';
import AllocationManagement from '../pages/Admin/AllocationManagement';
import AuditLogs from '../pages/Admin/AuditLogs';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/role-selection" element={<RoleSelectionPage />} />
      <Route path="/register/donor" element={<DonorRegisterPage />} />
      <Route path="/register/recipient" element={<RecipientRegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route path="/terms" element={<TermsAndConditionsPage />} />
      <Route path="/help" element={<HelpPage />} />

      {/* Notifications (Protected for logged in users) */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Donor Portal Routes */}
      <Route
        path="/donor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}>
            <DonorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/profile"
        element={
          <ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}>
            <DonorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/organs"
        element={
          <ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}>
            <DonationDetails />
          </ProtectedRoute>
        }
      />

      {/* Recipient Portal Routes */}
      <Route
        path="/recipient/dashboard"
        element={
          <ProtectedRoute allowedRoles={['RECIPIENT', 'ADMIN']}>
            <RecipientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipient/profile"
        element={
          <ProtectedRoute allowedRoles={['RECIPIENT', 'ADMIN']}>
            <RecipientProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipient/waiting-rank"
        element={
          <ProtectedRoute allowedRoles={['RECIPIENT', 'ADMIN']}>
            <WaitingListRank />
          </ProtectedRoute>
        }
      />

      {/* Admin Portal Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/donors"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DonorManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/recipients"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <RecipientManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/organs"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <OrganManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/matches"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <MatchManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/allocations"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AllocationManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AuditLogs />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
