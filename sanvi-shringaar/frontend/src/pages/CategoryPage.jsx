import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import ProductFormModal from "../components/ProductFormModal";
import CategoryFormModal from "../components/CategoryFormModal";
import { useAuth } from "../context/AuthContext";

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [toast, setToast] = useState("");

  const [showProdModal, setShowProdModal] = useState(false);
  const [editingProd, setEditingProd] = useState(null);
  const [showCatModal, setShowCatModal] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const load = () => {
    setLoading(true);
    setNotFound(false);
    return api
      .get(`/categories/${slug}`)
      .then((res) => {
        setCategory(res.data);
        return Promise.all([
          api.get("/products", { params: { category: res.data._id } }),
          api.get("/categories"),
        ]);
      })
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data);
        setAllCategories(catRes.data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleDeleteProduct = async (prod) => {
    if (!window.confirm(`Delete "${prod.name}"?`)) return;
    await api.delete(`/products/${prod._id}`);
    showToast("Item deleted");
    load();
  };

  const handleDeleteCategory = async () => {
    if (!window.confirm(`Delete "${category.name}" and all its items? This cannot be undone.`)) return;
    await api.delete(`/categories/${category._id}`);
    navigate("/");
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

          {isAuthenticated && (
            <div className="section-actions centered">
              <button className="btn btn-outline btn-sm" onClick={() => setShowCatModal(true)}>
                Edit Section
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setEditingProd(null);
                  setShowProdModal(true);
                }}
              >
                + Add Item
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleDeleteCategory}>
                Delete Section
              </button>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <h3>No items in this section yet</h3>
            <p>
              {isAuthenticated
                ? "Use \"+ Add Item\" above to add the first one."
                : "Family admin can add items from here after signing in."}
            </p>
          </div>
        ) : (
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
          </div>
        )}
      </div>

      {showProdModal && (
        <ProductFormModal
          product={editingProd}
          categories={allCategories.length ? allCategories : [category]}
          defaultCategory={category._id}
          onClose={() => setShowProdModal(false)}
          onSaved={() => {
            setShowProdModal(false);
            showToast(editingProd ? "Item updated" : "Item added");
            load();
          }}
        />
      )}

      {showCatModal && (
        <CategoryFormModal
          category={category}
          onClose={() => setShowCatModal(false)}
          onSaved={(saved) => {
            setShowCatModal(false);
            showToast("Category updated");
            if (saved?.slug && saved.slug !== slug) {
              navigate(`/category/${saved.slug}`, { replace: true });
            } else {
              load();
            }
          }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
