export default function MetricCard({ label, value, helper }) {
  return (
    <div className="card metric-card">
      <p className="label">{label}</p>
      <h3>{value}</h3>
      {helper ? <p className="helper">{helper}</p> : null}
    </div>
  );
}
