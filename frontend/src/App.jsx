import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import {
  initializeAuth,
  logout,
  selectAuthToken,
  selectIsAuthenticated,
  selectIsAuthChecking
} from "./store/slices/authSlice";

function ProtectedRoute({ token, isAuthChecking, isAuthenticated, children }) {
  if (isAuthChecking) {
    return <p className="text-sm text-slate-700">Verifying session...</p>;
  }

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

function App() {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const isAuthChecking = useSelector(selectIsAuthChecking);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f3ee]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_14%,_#e7e0d2_0%,_transparent_34%),radial-gradient(circle_at_85%_8%,_#d9e5d0_0%,_transparent_30%),radial-gradient(circle_at_52%_100%,_#f2e7d8_0%,_transparent_36%),linear-gradient(160deg,_#faf8f4_0%,_#f3efe8_48%,_#ece7de_100%)]" />
      <Navbar token={token} onLogout={handleLogout} />

      <main className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-14 pt-10 sm:px-6 lg:px-8">
        <Routes>
          <Route
            path="/"
            element={(
              <ProtectedRoute token={token} isAuthChecking={isAuthChecking} isAuthenticated={isAuthenticated}>
                <HomePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/cart"
            element={(
              <ProtectedRoute token={token} isAuthChecking={isAuthChecking} isAuthenticated={isAuthenticated}>
                <CartPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/orders"
            element={(
              <ProtectedRoute token={token} isAuthChecking={isAuthChecking} isAuthenticated={isAuthenticated}>
                <OrdersPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute token={token} isAuthChecking={isAuthChecking} isAuthenticated={isAuthenticated}>
                <ProfilePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/signin"
            element={isAuthenticated ? <Navigate to="/" replace /> : <SignInPage />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" replace /> : <SignUpPage />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
