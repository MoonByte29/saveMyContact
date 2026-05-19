import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AdminPanel from "../pages/AdminPanel";
import UploadPage from "../pages/UploadPage";
import UserImages from "../pages/UserImages";
import Header from "../components/Header";

// Routes where the Header should NOT appear (auth pages)
const HIDDEN_HEADER_ROUTES = ["/", "/register"];

// Map pathnames to Header's activePage IDs
function getActivePage(pathname) {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/uploads") || pathname.startsWith("/user-images")) return "uploads";
  if (pathname === "/dashboard") return "dashboard";
  return null; // auth routes — header won't render anyway
}

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const showHeader = !HIDDEN_HEADER_ROUTES.includes(location.pathname);
  const activePage = getActivePage(location.pathname);

  const handleNavigate = (pageId) => {
    const routes = {
      dashboard: "/dashboard",
      uploads: "/uploads",
      admin: "/admin",
    };
    navigate(routes[pageId]);
  };

  return (
    <>
      {showHeader && (
        <Header
          activePage={activePage}
          onNavigate={handleNavigate}
        />
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />

        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/uploads" element={<UploadPage />} />
        <Route path="/user-images/:id" element={<UserImages />} />
        <Route path="/admin/uploads/:userId" element={<UserImages />} />
      </Routes>
    </>
  );
}

function App() {
  return <AppLayout />;
}

export default App;