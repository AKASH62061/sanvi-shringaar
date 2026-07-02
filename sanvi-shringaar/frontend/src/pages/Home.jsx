import { useEffect, useState } from "react";
import api from "../api/axios";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const term = search.trim();
    if (!term) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      api
        .get("/products", { params: { search: term } })
        .then((res) => setSearchResults(res.data))
        .finally(() => setSearching(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="page">
      <div className="container">
        <div className="hero">
          <span className="hero-eyebrow">Family Price Catalog</span>
          <h1>Sanvi Shringaar &amp; Gift Corner</h1>
          <p>Browse every section of the shop and check the price of any item in seconds.</p>
          <div className="hero-divider" />
        </div>

        <div className="search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search any item by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {search.trim() ? (
          searching ? (
            <Loader />
          ) : searchResults && searchResults.length > 0 ? (
            <div className="grid">
              {searchResults.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No items found</h3>
              <p>Try a different name or brand.</p>
            </div>
          )
        ) : loading ? (
          <Loader />
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <h3>No sections yet</h3>
            <p>Log in as family admin to add your first category, like Lipstick or Bindi.</p>
          </div>
        ) : (
          <div className="grid">
            {categories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
