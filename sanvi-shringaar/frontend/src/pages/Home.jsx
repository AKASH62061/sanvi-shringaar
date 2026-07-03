import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import CategoryFormModal from "../components/CategoryFormModal";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const loadCategories = () => {
    setLoading(true);
    return api
      .get("/categories")
      .then((res) => setCategories(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
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

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete "${cat.name}" and all its items? This cannot be undone.`)) return;
    await api.delete(`/categories/${cat._id}`);
    showToast("Category deleted");
    loadCategories();
  };

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
        ) : categories.length === 0 && !isAuthenticated ? (
          <div className="empty-state">
            <h3>No sections yet</h3>
            <p>Log in as family admin to add your first category, like Lipstick or Bindi.</p>
          </div>
        ) : (
          <>
            <div className="section-header">
              <h2 className="section-title">Sections</h2>
              {isAuthenticated && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setEditingCat(null);
                    setShowCatModal(true);
                  }}
                >
                  + Add Category
                </button>
              )}
            </div>
            <div className="grid">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat._id}
                  category={cat}
                  isAdmin={isAuthenticated}
                  onEdit={(c) => {
                    setEditingCat(c);
                    setShowCatModal(true);
                  }}
                  onDelete={handleDeleteCategory}
                />
              ))}
              {isAuthenticated && (
                <button
                  type="button"
                  className="add-tile"
                  onClick={() => {
                    setEditingCat(null);
                    setShowCatModal(true);
                  }}
                >
                  <span className="add-tile-icon">+</span>
                  <span>Add Category</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {showCatModal && (
        <CategoryFormModal
          category={editingCat}
          onClose={() => setShowCatModal(false)}
          onSaved={() => {
            setShowCatModal(false);
            showToast(editingCat ? "Category updated" : "Category created");
            loadCategories();
          }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
