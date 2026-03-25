export default function PromptLogs({ logs }) {
  if (!logs) return null;

  return (
    <div className="logs-grid">
      <div className="card">
        <h3>System Prompt</h3>
        <pre>{logs.systemPrompt}</pre>
      </div>
      <div className="card">
        <h3>User Prompt</h3>
        <pre>{logs.userPrompt}</pre>
      </div>
      <div className="card full-width">
        <h3>Raw Model Output</h3>
        <pre>{logs.rawModelOutput}</pre>
      </div>
    </div>
  );
}
