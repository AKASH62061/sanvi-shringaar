import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/categories/${slug}`)
      .then((res) => {
        setCategory(res.data);
        return api.get("/products", { params: { category: res.data._id } });
      })
      .then((res) => setProducts(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;

  if (notFound) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h3>Section not found</h3>
          <Link to="/" className="btn btn-outline btn-sm">
            Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Catalog</Link> <span>/</span> <span>{category.name}</span>
        </div>
        <div className="hero" style={{ paddingTop: 0 }}>
          <h1>{category.name}</h1>
          {category.description && <p>{category.description}</p>}
          <div className="hero-divider" />
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <h3>No items in this section yet</h3>
            <p>Family admin can add items from the Admin panel.</p>
          </div>
        ) : (
          <div className="grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
