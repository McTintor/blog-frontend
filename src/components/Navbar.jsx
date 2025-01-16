import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";


const Navbar = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const renderLinks = () => {
    if (!user) {
      // If no user is logged in, show Login and Register
      return (
        <>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      );
    }

    // Links for logged-in users
    if (user.role === "reader") {
      return <Link to="/">Home</Link>; // Readers only have access to Home
    }

    if (user.role === "author") {
      return (
        <>
          <Link to="/">Home</Link>
          <Link to="/create-post">Create Post</Link>
          <Link
              to={`/posts/author/${user.username}`}
            >
              My Posts
            </Link>
        </>
      );
    }

    if (user.role === "admin") {
      return (
        <>
          <Link to="/">Home</Link>
          <Link to="/create-post">Create Post</Link>
          <Link to="/admin">Admin Panel</Link>
        </>
      );
    }
  };

  return (
    <nav className="nav">
      <div className="nav-container">{renderLinks()}
      {user && (
        <button className="brown" onClick={() => { logout(); navigate("/"); }}>
          Logout
        </button>      
      )}
      </div>
    </nav>
  );
};

export default Navbar;
