import "../static/css/Skeleton.css"

function SkeletonList({ count = 6 }) {
  return (
    <div className="doctor-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="doctor-card glass skeleton"
        >
          <div className="skeleton-img" />

          <div className="skeleton-line" />
          <div className="skeleton-line short" />
          <div className="skeleton-line short" />

          <div className="skeleton-btn" />
        </div>
      ))}
    </div>
  );
}


export default SkeletonList;
