import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

function Navbar() {
  const { user, logout } =
    useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link
          to="/dashboard"
          className="text-2xl font-bold"
        >
          Expense Tracker
        </Link>

        {user && (
          <div className="flex items-center gap-6">
            
            <Link to="/dashboard">
              Dashboard
            </Link>

            <Link to="/expenses">
              Expenses
            </Link>

            <Link to="/reports">
              Reports
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded"
            >
              Logout
            </button>

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;