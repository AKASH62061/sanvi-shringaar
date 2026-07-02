import { useEffect } from "react";
import { Link } from "react-router-dom";
import PriceRange from "./PriceRange";

export default function Lightbox({
  image,
  title,
  subtitle,
  minPrice,
  maxPrice,
  description,
  inStock,
  actionTo,
  actionLabel,
  onClose,
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-image-wrap">
          {image ? (
            <img src={image} alt={title} className="lightbox-image" />
          ) : (
            <div className="lightbox-image-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E9C4CB" strokeWidth="1.2">
                <rect x="4" y="7" width="16" height="13" rx="2" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
              <p>No photo added yet</p>
            </div>
          )}
        </div>

        <div className="lightbox-details">
          {subtitle && <span className="lightbox-subtitle">{subtitle}</span>}
          <h2>{title}</h2>

          {(minPrice !== undefined && maxPrice !== undefined) && (
            <PriceRange min={minPrice} max={maxPrice} />
          )}

          {inStock !== undefined && (
            <span className={`stock-badge ${inStock ? "in" : "out"} lightbox-stock`}>
              {inStock ? "In stock" : "Out of stock"}
            </span>
          )}

          {description && <p className="lightbox-description">{description}</p>}

          {actionTo && (
            <Link to={actionTo} className="btn btn-primary lightbox-action" onClick={onClose}>
              {actionLabel || "View"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
