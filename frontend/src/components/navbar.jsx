import { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../styles/navbar.css";
import { useLocation } from 'react-router-dom';
import Search from './search';
const Navbar = () => {
  const location = useLocation();
    
  
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const isAdminPage = location.pathname.startsWith('/admin');
    const showSearchBar = !isAuthPage && !isAdminPage;


  const { user, logout } = useAuth();
  
  // State to control the profile dropdown visibility
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.isAdmin;
  const username = user?.name || user?.username || user?.email || 'User'; 

  const handleLogout = () => {
    setIsProfileOpen(false); // Close menu on logout
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-brand-logo">
          <img src="logo.png" alt="kartio logo" />
          <span>kartio</span>
        </Link>
      </div>
     {showSearchBar && (
                <div className="nav-search">
                    <Search />
                </div>
            )}
      <ul className="navbar-links">
        <li>
          <Link to="/shop" className="navbar-link">Shop</Link>
        </li>
        <li>
          <Link to="/cart" className="navbar-link">Cart</Link>
        </li>
        
        {user ? (
          <>
            {/* Profile Dropdown Container */}
            <li className="navbar-profile-container" style={{ position: 'relative' }}>
              
              {/* Clickable Greeting to toggle the menu */}
              <div 
                className="navbar-greeting" 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                Hi, {username} 
                {isAdmin && <span className="admin-badge">Admin</span>}
                <span style={{ fontSize: '0.8em' }}>▼</span>
              </div>
              
              {/* The Dropdown Menu */}
              {isProfileOpen && (
                <div className="profile-dropdown-menu">
                  
                  {isAdmin && (
                     <Link 
                       to="/adminDashboard"
                       className="dropdown-item"
                       onClick={() => setIsProfileOpen(false)}
                     >
                       Dashboard
                     </Link>
                  )}

                  {/* Your new My Orders Link */}
                  <Link 
                    to="/myOrders"
                    className="dropdown-item" 
                    onClick={() => setIsProfileOpen(false)}
                  >
                    My Orders
                  </Link>

                  <button 
                    type="button" 
                    className="dropdown-item logout-btn" 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="navbar-link">Login</Link>
            </li>
            <li>
              <Link to="/register" className="navbar-action">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;