import { useState } from 'react';
import { analyzeWebsite } from './services/api';
import MetricCard from './components/MetricCard';
import InsightCard from './components/InsightCard';
import RecommendationList from './components/RecommendationList';
import PromptLogs from './components/PromptLogs';

const initialUrl = 'https://www.eight25media.com/';

export default function App() {
  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await analyzeWebsite(url);
      setData(result);
    } catch (err) {
      setData(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const metrics = data?.metrics;
  const insights = data?.insights;

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow"></p>
          <h1>Website Audit Tool</h1>
          <p className="hero-text">
            Analyze one webpage, separate factual metrics from AI insights.
          </p>
        </div>
      </header>

      <section className="card form-card">
        <form onSubmit={handleSubmit} className="audit-form">
          <label htmlFor="url">Website URL</label>
          <div className="input-row">
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </form>
        {error ? <p className="error">{error}</p> : null}
      </section>

      {data ? (
        <>
          <section className="section-block">
            <div className="section-title-row">
              <h2>Factual Metrics</h2>
              <span className="muted">Analyzed: {data.url}</span>
            </div>
            <div className="metric-grid">
              <MetricCard label="Word Count" value={metrics.wordCount} />
              <MetricCard label="H1" value={metrics.headingCounts.h1} />
              <MetricCard label="H2" value={metrics.headingCounts.h2} />
              <MetricCard label="H3" value={metrics.headingCounts.h3} />
              <MetricCard label="CTA Count" value={metrics.ctaCount} helper="Buttons + CTA-like action links" />
              <MetricCard label="Internal Links" value={metrics.internalLinks} />
              <MetricCard label="External Links" value={metrics.externalLinks} />
              <MetricCard label="Images" value={metrics.imageCount} />
              <MetricCard label="Missing Alt Text" value={`${metrics.imagesMissingAltPercentage}%`} helper={`${metrics.imagesMissingAlt} images missing alt`} />
            </div>
            <div className="meta-grid">
              <div className="card">
                <h3>Meta Title</h3>
                <p>{metrics.metaTitle || 'Not found'}</p>
              </div>
              <div className="card">
                <h3>Meta Description</h3>
                <p>{metrics.metaDescription || 'Not found'}</p>
              </div>
            </div>
          </section>

          <section className="section-block">
            <h2>AI Insights</h2>
            <div className="insight-grid">
              <InsightCard title="SEO Structure" text={insights.seoStructure} />
              <InsightCard title="Messaging Clarity" text={insights.messagingClarity} />
              <InsightCard title="CTA Usage" text={insights.ctaUsage} />
              <InsightCard title="Content Depth" text={insights.contentDepth} />
              <InsightCard title="UX / Structural Concerns" text={insights.uxStructuralConcerns} />
            </div>
          </section>

          <section className="section-block">
            <h2>Prioritized Recommendations</h2>
            <RecommendationList items={data.recommendations} />
          </section>

          <section className="section-block">
            <h2>Prompt Logs</h2>
            <PromptLogs logs={data.logs} />
          </section>
        </>
      ) : null}
    </div>
  );
}
