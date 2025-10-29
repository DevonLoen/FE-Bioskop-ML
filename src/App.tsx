import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./page/Main";
import LoginPage from "./page/Login";
import AdminDashboard from "./page/Admin";
import RegisterPage from "./page/Register"; // Import the new Register page
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} /> {/* Add route for Register */}

      {/* Protected User Route */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainPage />} />
      </Route>

      {/* Protected Admin Route */}
      <Route element={<ProtectedRoute adminOnly={true} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

       {/* Optional: Add a catch-all route or redirect for unknown paths */}
       {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}

export default App;

