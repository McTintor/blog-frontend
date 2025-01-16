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
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages

  const navigate = useNavigate();
  const queryParam = searchParams.get("query");
  const pageParam = searchParams.get("page");

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam); // Set input value from URL
      setSearchQuery(queryParam); // Update the displayed query in h1
    }
    const page = pageParam ? parseInt(pageParam) : 1;
    setCurrentPage(page); // Set current page from URL or default to 1
    fetchSearchResults(queryParam, page); // Fetch results for the current page
  }, [queryParam, pageParam]);

  const fetchSearchResults = async (query, page) => {
    try {
      const response = await searchPosts(query, page); // Make the API call
      if (response.data && response.data.posts) {
        setPosts(response.data.posts); // Set posts
        setTotalPages(response.data.totalPages || 1); // Fallback to 1 if undefined
      } else {
        setPosts([]);
        setError("No posts found for your search query.");
      }
      setError("");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("An error occurred while fetching search results.");
      setPosts([]); // Clear posts if an error occurs
    }
  };

  const handleSearch = () => {
    if (!query.trim()) {
      setWarning("Please enter a search query.");
      return;
    }
    setWarning(""); // Clear warning
    navigate(`/search?query=${encodeURIComponent(query)}&page=1`); // Update URL with query and reset page to 1
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update current page
    setSearchParams({ query: searchQuery, page }); // Update the page query parameter in the URL
    fetchSearchResults(searchQuery, page); // Fetch results for the new page
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                className={`pagination-button ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
                disabled={currentPage === page} // Disable current page button
              >
                {page}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
