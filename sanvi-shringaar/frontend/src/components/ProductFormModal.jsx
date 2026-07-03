import { useState } from "react";
import api from "../api/axios";

export default function ProductFormModal({ product, categories, defaultCategory, onClose, onSaved }) {
  const [name, setName] = useState(product?.name || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [category, setCategory] = useState(
    product?.category?._id || product?.category || defaultCategory || (categories[0]?._id ?? "")
  );
  const [minPrice, setMinPrice] = useState(product?.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(product?.maxPrice ?? "");
  const [description, setDescription] = useState(product?.description || "");
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(product?.image?.url || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Product name is required");
    if (!category) return setError("Please select a category");
    if (minPrice === "" || maxPrice === "") return setError("Both min and max price are required");
    if (Number(minPrice) < 0 || Number(maxPrice) < 0) return setError("Prices cannot be negative");
    if (Number(minPrice) > Number(maxPrice))
      return setError("Minimum price cannot be greater than maximum price");

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("category", category);
      formData.append("minPrice", minPrice);
      formData.append("maxPrice", maxPrice);
      formData.append("brand", brand);
      formData.append("description", description);
      formData.append("inStock", inStock);
      if (file) formData.append("image", file);

      if (product) {
        await api.put(`/products/${product._id}`, formData);
      } else {
        await api.post("/products", formData);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{product ? "Edit Item" : "New Item"}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {preview && (
            <div className="file-preview">
              <img src={preview} alt="preview" />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="prod-image">Photo (optional)</label>
            <label className="file-input" htmlFor="prod-image">
              {file ? file.name : "Click to choose an image"}
            </label>
            <input
              id="prod-image"
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="prod-name">Item name *</label>
            <input
              id="prod-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Matte Red Lipstick"
            />
          </div>

          <div className="form-group">
            <label htmlFor="prod-category">Category *</label>
            <select id="prod-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prod-min">Min price (₹) *</label>
              <input
                id="prod-min"
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="99"
              />
            </div>
            <div className="form-group">
              <label htmlFor="prod-max">Max price (₹) *</label>
              <input
                id="prod-max"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="149"
              />
            </div>
          </div>
          <p className="helper-text" style={{ marginTop: "-10px", marginBottom: "16px" }}>
            If the item has one fixed price, enter the same value in both fields.
          </p>

          <div className="form-group">
            <label htmlFor="prod-brand">Brand (optional)</label>
            <input
              id="prod-brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Lakme"
            />
          </div>

          <div className="form-group">
            <label htmlFor="prod-desc">Notes (optional)</label>
            <textarea
              id="prod-desc"
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Shade, size, or any other detail"
            />
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                style={{ width: "auto" }}
              />
              Currently in stock
            </label>
          </div>

          {error && <div className="error-text">{error}</div>}
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={saving}>
            {saving ? "Saving..." : product ? "Save changes" : "Add item"}
          </button>
        </form>
      </div>
    </div>
  );
}
