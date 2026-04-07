import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AdminLayout } from './components/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { SitesPage } from './pages/admin/SitesPage'
import { PagesPage } from './pages/admin/PagesPage'
import { PageCommentsPage } from './pages/admin/PageCommentsPage'
import { CommentsPage } from './pages/admin/CommentsPage'

export const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>
    <Route
      element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/admin/sites" element={<SitesPage />} />
      <Route path="/admin/sites/:siteId/pages" element={<PagesPage />} />
      <Route path="/admin/sites/:siteId/pages/:pageId/comments" element={<PageCommentsPage />} />
      <Route path="/admin/comments" element={<CommentsPage />} />
    </Route>
  </Routes>
)
