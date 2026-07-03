export default function PriceRange({ min, max }) {
  if (min === max) {
    return (
      <div className="price-pill">
        <span className="rupee">₹</span>
        <span className="amount">{min}</span>
      </div>
    );
  }

  return (
    <div className="price-pill">
      <span className="rupee">₹</span>
      <span className="amount">{min}</span>
      <span className="sep">–</span>
      <span className="rupee">₹</span>
      <span className="amount">{max}</span>
    </div>
  );
}
