import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function NavSearch() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const q = term.trim();
    if (!q) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      api
        .get("/products", { params: { search: q } })
        .then((res) => {
          setResults(res.data.slice(0, 8));
          setOpen(true);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [term]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const goToResult = (product) => {
    setOpen(false);
    setTerm("");
    if (product.category?.slug) {
      navigate(`/category/${product.category.slug}`);
    } else {
      navigate("/");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      e.target.blur();
    }
  };

  return (
    <div className="nav-search" ref={wrapRef}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        placeholder="Search items..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onFocus={() => term.trim() && setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {term.trim() && (
        <button
          type="button"
          className="nav-search-clear"
          aria-label="Clear search"
          onClick={() => {
            setTerm("");
            setOpen(false);
          }}
        >
          ×
        </button>
      )}

      {open && (
        <div className="nav-search-dropdown">
          {loading ? (
            <div className="nav-search-empty">Searching...</div>
          ) : results.length === 0 ? (
            <div className="nav-search-empty">No items found for "{term.trim()}"</div>
          ) : (
            results.map((p) => (
              <button
                type="button"
                key={p._id}
                className="nav-search-item"
                onClick={() => goToResult(p)}
              >
                <span className="nav-search-thumb">
                  {p.image?.url ? (
                    <img src={p.image.url} alt={p.name} />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4D4D8" strokeWidth="1.5">
                      <rect x="4" y="7" width="16" height="13" rx="2" />
                      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                    </svg>
                  )}
                </span>
                <span className="nav-search-info">
                  <span className="nav-search-name">{p.name}</span>
                  <span className="nav-search-meta">
                    {p.category?.name || "Uncategorized"}
                    {p.brand ? ` · ${p.brand}` : ""}
                  </span>
                </span>
                <span className="nav-search-price">
                  ₹{p.minPrice === p.maxPrice ? p.minPrice : `${p.minPrice}–${p.maxPrice}`}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
