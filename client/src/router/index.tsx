import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from '../pages/Login'
import DashboardPage from '../pages/Dashboard'
import CoursesPage from '../pages/Courses'
import StudentsPage from '../pages/Students'
import SummaryPage from '../pages/Summary'
import ProtectedRoute from '../components/ProtectedRoute'
import MainLayout from '../layouts/MainLayout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'courses',
        element: <CoursesPage />,
      },
      {
        path: 'students',
        element: <StudentsPage />,
      },
      {
        path: 'summary',
        element: <SummaryPage />,
      },
    ],
  },
])

export default router