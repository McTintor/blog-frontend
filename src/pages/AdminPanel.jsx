import { useState } from "react";
import { promoteUser } from "../services/api";

const AdminPanel = () => {
  const [username, setUsername] = useState("");
  const [newRole, setNewRole] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePromote = async (e) => {
    e.preventDefault();

    try {
      const response = await promoteUser(username, newRole);
      setMessage(response.data.message);
      setError("");
      setUsername("");
      setNewRole("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setMessage("");
    }
  };

  return (
    <div className="admin-panel">
      <h1>Change user role</h1>
      <form onSubmit={handlePromote} className="promote-form">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          New Role:
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            required
          >
            <option value="">Select a role</option>
            <option value="reader">Reader</option>
            <option value="author">Author</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button className="submit-button" type="submit">Promote</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

    </div>
  );
};

export default AdminPanel;
