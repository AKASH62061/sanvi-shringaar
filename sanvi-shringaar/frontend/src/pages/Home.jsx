import { useEffect, useState } from "react";
import api from "../api/axios";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import CategoryFormModal from "../components/CategoryFormModal";
import ProductFormModal from "../components/ProductFormModal";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [toast, setToast] = useState("");

  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [showProdModal, setShowProdModal] = useState(false);
  const [editingProd, setEditingProd] = useState(null);

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

  const rerunSearch = (term) => {
    const q = term.trim();
    if (!q) return;
    setSearching(true);
    api
      .get("/products", { params: { search: q } })
      .then((res) => setSearchResults(res.data))
      .finally(() => setSearching(false));
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

  const handleDeleteProduct = async (prod) => {
    if (!window.confirm(`Delete "${prod.name}"?`)) return;
    await api.delete(`/products/${prod._id}`);
    showToast("Item deleted");
    rerunSearch(search);
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

        {isAuthenticated && !search.trim() && (
          <div className="section-actions">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditingCat(null);
                setShowCatModal(true);
              }}
            >
              + Add Category
            </button>
          </div>
        )}

        {search.trim() ? (
          searching ? (
            <Loader />
          ) : searchResults && searchResults.length > 0 ? (
            <div className="grid">
              {searchResults.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  isAdmin={isAuthenticated}
                  onEdit={(prod) => {
                    setEditingProd(prod);
                    setShowProdModal(true);
                  }}
                  onDelete={handleDeleteProduct}
                />
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
          </div>
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

      {showProdModal && (
        <ProductFormModal
          product={editingProd}
          categories={categories}
          defaultCategory={editingProd?.category?._id || editingProd?.category || ""}
          onClose={() => setShowProdModal(false)}
          onSaved={() => {
            setShowProdModal(false);
            showToast(editingProd ? "Item updated" : "Item added");
            rerunSearch(search);
            loadCategories();
          }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
