import { useState } from "react";
import { Link } from "react-router-dom";
import Lightbox from "./Lightbox";

export default function CategoryCard({ category, isAdmin, onEdit, onDelete }) {
  const [showLightbox, setShowLightbox] = useState(false);

  return (
    <>
      <div className="category-card">
        {isAdmin && (
          <div className="card-admin-actions">
            <button
              type="button"
              className="card-admin-btn"
              aria-label={`Edit ${category.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(category);
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
            </button>
            <button
              type="button"
              className="card-admin-btn danger"
              aria-label={`Delete ${category.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(category);
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6h14z" />
              </svg>
            </button>
          </div>
        )}
        <button
          type="button"
          className="category-card-image image-trigger"
          onClick={() => setShowLightbox(true)}
          aria-label={`View ${category.name} full screen`}
        >
          {category.image?.url ? (
            <img src={category.image.url} alt={category.name} />
          ) : (
            <svg
              className="placeholder-icon"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M9 2h6l1 4H8l1-4z" />
              <path d="M6 6h12l1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 6z" />
            </svg>
          )}
          <span className="zoom-hint" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M11 8v6M8 11h6" />
            </svg>
          </span>
        </button>
        <Link to={`/category/${category.slug}`} className="category-card-body">
          <h3>{category.name}</h3>
          <div className="count">
            {category.productCount} {category.productCount === 1 ? "item" : "items"}
          </div>
        </Link>
      </div>

      {showLightbox && (
        <Lightbox
          image={category.image?.url}
          title={category.name}
          subtitle={`${category.productCount} ${category.productCount === 1 ? "item" : "items"}`}
          description={category.description}
          actionTo={`/category/${category.slug}`}
          actionLabel="View items in this section"
          onClose={() => setShowLightbox(false)}
        />
      )}
    </>
  );
}
