import { useState } from "react";
import PriceRange from "./PriceRange";
import Lightbox from "./Lightbox";

export default function ProductCard({ product, isAdmin, onEdit, onDelete }) {
  const [showLightbox, setShowLightbox] = useState(false);

  return (
    <>
      <div className="product-card">
        {isAdmin && (
          <div className="card-admin-actions">
            <button
              type="button"
              className="card-admin-btn"
              aria-label={`Edit ${product.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
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
              aria-label={`Delete ${product.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product);
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
          className="product-card-image image-trigger"
          onClick={() => setShowLightbox(true)}
          aria-label={`View ${product.name} full screen`}
        >
          {product.image?.url ? (
            <img src={product.image.url} alt={product.name} />
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4D4D8" strokeWidth="1.5">
              <rect x="4" y="7" width="16" height="13" rx="2" />
              <path d="M9 7V5a3 3 0 0 1 6 0v2" />
            </svg>
          )}
          <span className={`stock-badge ${product.inStock ? "in" : "out"}`}>
            {product.inStock ? "In stock" : "Out of stock"}
          </span>
          <span className="zoom-hint" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M11 8v6M8 11h6" />
            </svg>
          </span>
        </button>
        <div className="product-card-body">
          {product.brand ? <span className="brand">{product.brand}</span> : null}
          <h4>{product.name}</h4>
          <PriceRange min={product.minPrice} max={product.maxPrice} />
        </div>
      </div>

      {showLightbox && (
        <Lightbox
          image={product.image?.url}
          title={product.name}
          subtitle={product.brand}
          minPrice={product.minPrice}
          maxPrice={product.maxPrice}
          description={product.description}
          inStock={product.inStock}
          onClose={() => setShowLightbox(false)}
        />
      )}
    </>
  );
}
