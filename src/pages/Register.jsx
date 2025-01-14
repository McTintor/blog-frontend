import { useState } from "react";
import { register } from "../services/api";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      setSuccess("Registration successful! Please log in.");
      setError("");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setSuccess("");
    }
  };

  return (
    <div className="register-container">
      <h1>Register here:</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
          type="text"
          name="username"
          placeholder="user123"
          value={formData.name}
          onChange={handleChange}
          required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
          type="email"
          name="email"
          placeholder="email@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
          type="password"
          name="password"
          placeholder="********"
          value={formData.password}
          onChange={handleChange}
          required
          />
        </div>
        <button className="submit-button" type="submit">Confirm</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default Register;
