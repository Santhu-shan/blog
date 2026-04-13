import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PenSquare, LogOut, User as UserIcon } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <Link to="/" className="nav-logo">
          <span className="gradient-text">BlogSpace</span>
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <span className="nav-user"><UserIcon size={18} /> {user.username}</span>
              <Link to="/create-post" className="btn btn-primary btn-sm">
                <PenSquare size={16} /> Write
              </Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
