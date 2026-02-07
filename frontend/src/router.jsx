import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import IndexRedirect from './pages/IndexRedirect';
import HomeSkeleton from './components/skeletons/HomeSkeleton';
import AboutSkeleton from './components/skeletons/AboutSkeleton';
import { homeLoader } from './loaders/home';
import { aboutLoader } from './loaders/about';

const Home = lazy(() => import('./pages/home/home'));
const About = lazy(() => import('./pages/about/about'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Onboarding = lazy(() => import('./pages/onboarding/Onboarding'));

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorBoundary />}>
      <Route index element={<IndexRedirect />} />
      <Route
        path="login"
        element={
          <GuestRoute>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center" />}>
              <Login />
            </Suspense>
          </GuestRoute>
        }
      />
      <Route
        path="register"
        element={
          <GuestRoute>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center" />}>
              <Register />
            </Suspense>
          </GuestRoute>
        }
      />
      <Route
        path="onboarding"
        element={
          <ProtectedRoute>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center" />}>
              <Onboarding />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          path="home"
          element={
            <Suspense fallback={<HomeSkeleton />}>
              <Home />
            </Suspense>
          }
          loader={homeLoader}
        />
        <Route
          path="about"
          element={
            <Suspense fallback={<AboutSkeleton />}>
              <About />
            </Suspense>
          }
          loader={aboutLoader}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);
