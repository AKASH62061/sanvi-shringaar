import { useState } from "react";
import api from "../api/axios";

export default function CategoryFormModal({ category, onClose, onSaved }) {
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(category?.image?.url || "");
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
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description);
      if (file) formData.append("image", file);

      if (category) {
        await api.put(`/categories/${category._id}`, formData);
      } else {
        await api.post("/categories", formData);
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
          <h3>{category ? "Edit Category" : "New Category"}</h3>
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
            <label htmlFor="cat-image">Category photo (optional)</label>
            <label className="file-input" htmlFor="cat-image">
              {file ? file.name : "Click to choose an image"}
            </label>
            <input
              id="cat-image"
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cat-name">Category name *</label>
            <input
              id="cat-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lipstick"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cat-desc">Description (optional)</label>
            <textarea
              id="cat-desc"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short note about this section"
            />
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={saving}>
            {saving ? "Saving..." : category ? "Save changes" : "Create category"}
          </button>
        </form>
      </div>
    </div>
  );
}
