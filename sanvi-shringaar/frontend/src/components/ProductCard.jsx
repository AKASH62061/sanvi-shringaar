import { useState } from "react";
import PriceRange from "./PriceRange";
import Lightbox from "./Lightbox";

export default function ProductCard({ product }) {
  const [showLightbox, setShowLightbox] = useState(false);

  return (
    <>
      <div className="product-card">
        <button
          type="button"
          className="product-card-image image-trigger"
          onClick={() => setShowLightbox(true)}
          aria-label={`View ${product.name} full screen`}
        >
          {product.image?.url ? (
            <img src={product.image.url} alt={product.name} />
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E9C4CB" strokeWidth="1.5">
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
