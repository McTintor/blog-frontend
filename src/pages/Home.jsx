/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { getPosts, searchPosts } from "../services/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(""); // State for search query
  const [searchError, setSearchError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract search query from URL on load
  useEffect(() => {
    const queryParam = searchParams.get("query") || "";
    setQuery(queryParam);
    fetchPosts(queryParam);
  }, [searchParams]);

  // Fetch posts from the backend
  const fetchPosts = async (searchQuery = "") => {
    try {
      const response = await getPosts(searchQuery); // Pass searchQuery if present
      setPosts(response.data);
    } catch (err) {
      setError("Failed to fetch posts");
    }
  };

  // Handle search functionality
  const handleSearch = async () => {
    try {
      // Update the browser URL to reflect the search query
      navigate(`/search?query=${encodeURIComponent(query)}`);
  
      const response = await searchPosts(query); // Make the API call to search for posts
      setPosts(response.data);
      setSearchError("");
    } catch (err) {
      setSearchError("No posts found for your search query.");
      setPosts([]); // Clear posts if no results
    }
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
          required
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {searchError && <p style={{ color: "red" }}>{searchError}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

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
