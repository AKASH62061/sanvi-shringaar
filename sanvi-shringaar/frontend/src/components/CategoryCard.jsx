import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link to={`/category/${category.slug}`} className="category-card">
      <div className="category-card-image">
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
      </div>
      <div className="category-card-body">
        <h3>{category.name}</h3>
        <div className="count">
          {category.productCount} {category.productCount === 1 ? "item" : "items"}
        </div>
      </div>
    </Link>
  );
}
