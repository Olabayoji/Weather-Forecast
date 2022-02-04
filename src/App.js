import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./components/UI/Loader";

// Lazy loading
const Homepage = React.lazy(() => import("./pages/HomePage.js"));
const AuthPage = React.lazy(() => import("./pages/AuthPage"));
const ResetPassword = React.lazy(() =>
  import("./components/Auth/ResetPassword.js")
);
const ErrorPage = React.lazy(() => import("./pages/ErrorPage.js"));
const SettingsPage = React.lazy(() => import("./pages/SettingsPage.js"));

const App = () => {
  return (
    <Suspense
      fallback={() => (
        <div className="centered">
          <Loader />
        </div>
      )}
    >
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/reset-password"
          element={
            <RequireNoAuth redirectTo="/">
              <ResetPassword />
            </RequireNoAuth>
          }
        />
        <Route
          path="/:auth"
          element={
            <RequireNoAuth redirectTo="/">
              <AuthPage />
            </RequireNoAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth redirectTo="/">
              <SettingsPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;

function RequireAuth({ children, redirectTo }) {
  const loggedIn = useSelector((state) => state.auth.loginToken);
  return loggedIn ? children : <Navigate to={redirectTo} />;
}

function RequireNoAuth({ children, redirectTo }) {
  const loggedIn = useSelector((state) => state.auth.loginToken);
  return !loggedIn ? children : <Navigate to={redirectTo} />;
}
