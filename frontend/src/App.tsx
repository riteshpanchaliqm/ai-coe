import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { SubmitPage } from './pages/SubmitPage';
import { ProposalsPage } from './pages/ProposalsPage';
import { ProposalDetailPage } from './pages/ProposalDetailPage';
import { MyProposalsPage } from './pages/MyProposalsPage';
import { ReviewPage } from './pages/ReviewPage';
import { AdminMembersPage } from './pages/admin/AdminMembersPage';
import { AdminGuidelinesPage } from './pages/admin/AdminGuidelinesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { GuidelinesPage } from './pages/GuidelinesPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/submit" element={<SubmitPage />} />
                <Route path="/proposals" element={<ProposalsPage />} />
                <Route path="/proposals/:id" element={<ProposalDetailPage />} />
                <Route path="/my-proposals" element={<MyProposalsPage />} />
                <Route path="/guidelines" element={<GuidelinesPage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/admin/members" element={<AdminMembersPage />} />
                <Route path="/admin/guidelines" element={<AdminGuidelinesPage />} />
                <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
