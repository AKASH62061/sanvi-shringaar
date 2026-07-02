import PriceRange from "./PriceRange";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-card-image">
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
      </div>
      <div className="product-card-body">
        {product.brand ? <span className="brand">{product.brand}</span> : null}
        <h4>{product.name}</h4>
        <PriceRange min={product.minPrice} max={product.maxPrice} />
      </div>
    </div>
  );
}
