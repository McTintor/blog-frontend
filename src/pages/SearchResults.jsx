import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchPosts } from "../services/api";
import { Link } from "react-router-dom";

const SearchResults = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(""); // For search input value
  const [searchQuery, setSearchQuery] = useState(""); // To store confirmed query for h1
  const [warning, setWarning] = useState(""); // For empty query warning
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const queryParam = searchParams.get("query");

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam); // Set input value from URL
      setSearchQuery(queryParam); // Update the displayed query in h1
      fetchSearchResults(queryParam); // Fetch results on queryParam change
    }
  }, [queryParam]);

  const fetchSearchResults = async (query) => {
    try {
      const response = await searchPosts(query); // Make the API call
      setPosts(response.data);
      setError("");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("No posts found for your search query.");
      setPosts([]); // Clear posts if no results
    }
  };

  const handleSearch = () => {
    if (!query.trim()) {
      setWarning("Please enter a search query.");
      return;
    }
    setWarning(""); // Clear warning
    navigate(`/search?query=${encodeURIComponent(query)}`); // Update URL
  };

  return (
    <div className="mainpage-container">
      <div className="search-bar-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search by title or author username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Allow typing in the search input
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {warning && <p style={{ color: "orange" }}>{warning}</p>} {/* Warning message */}
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Error message */}
      {searchQuery && <h1>Search Results for &quot;{searchQuery}&quot;</h1>}

      {posts.length === 0 && !error && searchQuery && (
        <p>No results found for &quot;{searchQuery}&quot;.</p>
      )}

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

export default SearchResults;
