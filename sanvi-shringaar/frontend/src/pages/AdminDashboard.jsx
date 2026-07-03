import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import CategoryFormModal from "../components/CategoryFormModal";
import ProductFormModal from "../components/ProductFormModal";

export default function AdminDashboard() {
  const [tab, setTab] = useState("products");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [showProdModal, setShowProdModal] = useState(false);
  const [editingProd, setEditingProd] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [catsRes, prodsRes] = await Promise.all([
        api.get("/categories"),
        api.get("/products", filterCategory ? { params: { category: filterCategory } } : undefined),
      ]);
      setCategories(catsRes.data);
      setProducts(prodsRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory]);

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete "${cat.name}" and all its items? This cannot be undone.`)) return;
    await api.delete(`/categories/${cat._id}`);
    showToast("Category deleted");
    loadAll();
  };

  const handleDeleteProduct = async (prod) => {
    if (!window.confirm(`Delete "${prod.name}"?`)) return;
    await api.delete(`/products/${prod._id}`);
    showToast("Item deleted");
    loadAll();
  };

  return (
    <div className="page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Admin Panel</h1>
            <p className="helper-text">Manage sections and item prices</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (tab === "categories") {
                setEditingCat(null);
                setShowCatModal(true);
              } else {
                if (categories.length === 0) {
                  showToast("Create a category first");
                  return;
                }
                setEditingProd(null);
                setShowProdModal(true);
              }
            }}
          >
            + Add {tab === "categories" ? "Category" : "Item"}
          </button>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === "products" ? "active" : ""}`}
            onClick={() => setTab("products")}
          >
            Items
          </button>
          <button
            className={`admin-tab ${tab === "categories" ? "active" : ""}`}
            onClick={() => setTab("categories")}
          >
            Categories
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : tab === "categories" ? (
          categories.length === 0 ? (
            <div className="empty-state">
              <h3>No categories yet</h3>
              <p>Add your first section, e.g. Lipstick, Bindi, or Bangles.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Items</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>
                      {cat.image?.url ? (
                        <img className="admin-thumb" src={cat.image.url} alt={cat.name} />
                      ) : (
                        <div className="admin-thumb" />
                      )}
                    </td>
                    <td>{cat.name}</td>
                    <td>{cat.productCount}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setEditingCat(cat);
                            setShowCatModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCategory(cat)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          <>
            <div className="form-group" style={{ maxWidth: 260, marginBottom: 20 }}>
              <label htmlFor="filter-cat">Filter by category</label>
              <select
                id="filter-cat"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {products.length === 0 ? (
              <div className="empty-state">
                <h3>No items yet</h3>
                <p>Add your first item with a photo and price range.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price (₹)</th>
                    <th>Stock</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        {p.image?.url ? (
                          <img className="admin-thumb" src={p.image.url} alt={p.name} />
                        ) : (
                          <div className="admin-thumb" />
                        )}
                      </td>
                      <td>{p.name}</td>
                      <td>{p.category?.name || "-"}</td>
                      <td>
                        {p.minPrice === p.maxPrice ? p.minPrice : `${p.minPrice} - ${p.maxPrice}`}
                      </td>
                      <td>{p.inStock ? "In stock" : "Out of stock"}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              setEditingProd(p);
                              setShowProdModal(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteProduct(p)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
            loadAll();
          }}
        />
      )}

      {showProdModal && (
        <ProductFormModal
          product={editingProd}
          categories={categories}
          defaultCategory={filterCategory}
          onClose={() => setShowProdModal(false)}
          onSaved={() => {
            setShowProdModal(false);
            showToast(editingProd ? "Item updated" : "Item added");
            loadAll();
          }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
