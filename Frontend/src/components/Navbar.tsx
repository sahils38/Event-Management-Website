import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, LogOut, PlusCircle, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('https://event-management-website-qaje.onrender.com/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Ensures cookies are included in the request
      });
  
      logout(); // Clear user state in frontend
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-semibold text-gray-900">EventHub</span>
            </Link>
          </div>

          {/* Right Side (Create Event + User Profile) */}
          <div className="flex items-center space-x-4">
            <Link
              to="/events/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Event
            </Link>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <User className="h-5 w-5" />
                <span>{user?.name || 'Guest User'}</span>
              </button>

              {/* Dropdown Menu (Conditionally Rendered) */}
              {isDropdownOpen && (
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg border">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
