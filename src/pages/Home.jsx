import { useEffect, useState } from "react";
import { getPosts } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(""); // State for search query
  const [warning, setWarning] = useState(""); // For empty query warning

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts(); // Fetch all posts initially
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getPosts(); // Fetch all posts
      setPosts(response.data);
      setError("");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to fetch posts");
    }
  };

  const handleSearch = () => {
    if (!query.trim()) {
      setWarning("Please enter a search query.");
      return;
    }
    setWarning(""); // Clear warning
    navigate(`/search?query=${encodeURIComponent(query)}`); // Navigate to SearchResults with query
  };

  return (
    <div className="mainpage-container">
      <div className="search-bar-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search by title or author username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {warning && <p style={{ color: "orange" }}>{warning}</p>} {/* Warning message */}
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Error message */}
      <h1>All Posts</h1>
      {posts.map((post) => (
        <div key={post.id} className="mainpage-post-container">
          <h2>
            <Link to={`/posts/${post.id}`} className="hover-text">
              {post.title}
            </Link>
          </h2>
          <p>
            by{" "}
            <Link
              className="username-hover"
              to={`/posts/author/${post.author.username}`}
            >
              {post.author.username}
            </Link>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Home;
