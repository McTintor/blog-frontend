import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(email, password);
      const token = response.data.token;
      const user = response.data.user;

      // Save token and user data, then update global auth state
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      loginUser({ user, token });

      // Redirect to home
      navigate("/");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login here:</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button className="submit-button" type="submit">Log in</button>
      </form>
    </div>
  );
};

export default Login;
