import { useState } from "react";
import { createPost } from "../services/api";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
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
      await createPost(formData);
      setSuccess("Post created successfully!");
      setError("");
      setFormData({ title: "", content: "" });

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
      console.error(err);
      setSuccess("");
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create Post</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form className="create-post-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="modern-input"
        />
        <textarea
          className="modern-textarea"
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreatePost;
