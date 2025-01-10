import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul className="nav-ul">
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/create-post">Create Post</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
