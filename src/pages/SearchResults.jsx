import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchPosts } from "../services/api";
import { Link } from "react-router-dom";

const SearchResults = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(""); // For search input value
  const [searchQuery, setSearchQuery] = useState(""); // To store confirmed query for h1
  const [searchParams] = useSearchParams();
  
  const navigate = useNavigate();
  const queryParam = searchParams.get("query");

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam); // Set the query from the URL
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

  const handleSearch = async () => {
    try {
      // Update the browser URL to reflect the search query
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setSearchQuery(query); // Update the search query after search
      fetchSearchResults(query);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("No posts found for your search query.");
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
          onChange={(e) => setQuery(e.target.value)} // Make input editable
          required
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display the search query only after the user has clicked the search button */}
      {searchQuery && <h1>Search Results for &quot;{searchQuery}&quot;</h1>}

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
