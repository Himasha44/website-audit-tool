export default function RecommendationList({ items }) {
  if (!items?.length) {
    return <div className="card"><p>No AI recommendations yet.</p></div>;
  }

  return (
    <div className="recommendation-list">
      {items
        .slice()
        .sort((a, b) => a.priority - b.priority)
        .map((item) => (
          <div className="card" key={`${item.priority}-${item.title}`}>
            <div className="recommendation-header">
              <span className="badge">Priority {item.priority}</span>
              <h3>{item.title}</h3>
            </div>
            <p><strong>Why:</strong> {item.reasoning}</p>
            <p><strong>Action:</strong> {item.action}</p>
          </div>
        ))}
    </div>
  );
}
