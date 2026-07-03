import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import ProductFormModal from "../components/ProductFormModal";

export default function CategoryPage() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showProdModal, setShowProdModal] = useState(false);
  const [editingProd, setEditingProd] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const loadData = () => {
    setLoading(true);
    setNotFound(false);
    return api
      .get(`/categories/${slug}`)
      .then((res) => {
        setCategory(res.data);
        return api.get("/products", { params: { category: res.data._id } });
      })
      .then((res) => setProducts(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleDeleteProduct = async (prod) => {
    if (!window.confirm(`Delete "${prod.name}"?`)) return;
    await api.delete(`/products/${prod._id}`);
    showToast("Item deleted");
    loadData();
  };

  if (loading) return <Loader />;

  if (notFound) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h3>Section not found</h3>
          <Link to="/" className="btn btn-outline btn-sm">
            Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Catalog</Link> <span>/</span> <span>{category.name}</span>
        </div>
        <div className="hero" style={{ paddingTop: 0 }}>
          <h1>{category.name}</h1>
          {category.description && <p>{category.description}</p>}
          <div className="hero-divider" />
        </div>

        {products.length === 0 && !isAuthenticated ? (
          <div className="empty-state">
            <h3>No items in this section yet</h3>
            <p>Family admin can add items from here after logging in.</p>
          </div>
        ) : (
          <>
            <div className="section-header">
              <h2 className="section-title">Items</h2>
              {isAuthenticated && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setEditingProd(null);
                    setShowProdModal(true);
                  }}
                >
                  + Add Item
                </button>
              )}
            </div>
            <div className="grid">
              {products.map((p) => (
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
              {isAuthenticated && (
                <button
                  type="button"
                  className="add-tile"
                  onClick={() => {
                    setEditingProd(null);
                    setShowProdModal(true);
                  }}
                >
                  <span className="add-tile-icon">+</span>
                  <span>Add Item</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {showProdModal && (
        <ProductFormModal
          product={editingProd}
          categories={category ? [category] : []}
          defaultCategory={category?._id}
          onClose={() => setShowProdModal(false)}
          onSaved={() => {
            setShowProdModal(false);
            showToast(editingProd ? "Item updated" : "Item added");
            loadData();
          }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
