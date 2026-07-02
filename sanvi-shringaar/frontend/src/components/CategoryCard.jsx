// import { Link } from "react-router-dom";

// export default function CategoryCard({ category }) {
//   return (
//     <Link to={`/category/${category.slug}`} className="category-card">
//       <div className="category-card-image">
//         {category.image?.url ? (
//           <img src={category.image.url} alt={category.name} />
//         ) : (
//           <svg
//             className="placeholder-icon"
//             width="48"
//             height="48"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="1.5"
//           >
//             <path d="M9 2h6l1 4H8l1-4z" />
//             <path d="M6 6h12l1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 6z" />
//           </svg>
//         )}
//       </div>
//       <div className="category-card-body">
//         <h3>{category.name}</h3>
//         <div className="count">
//           {category.productCount} {category.productCount === 1 ? "item" : "items"}
//         </div>
//       </div>
//     </Link>
//   );
// }



import { useState } from "react";
import { Link } from "react-router-dom";
import Lightbox from "./Lightbox";

export default function CategoryCard({ category }) {
  const [showLightbox, setShowLightbox] = useState(false);

  return (
    <>
      <div className="category-card">
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
