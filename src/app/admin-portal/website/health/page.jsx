'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContentHealthPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/health');
      if (!res.ok) throw new Error('Failed to load content health data');
      const healthData = await res.json();
      setData(healthData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  if (loading) return <div className="loading-state">Analyzing content database...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  const { summary, issues = [], anomalies = [] } = data || {};

  return (
    <div className="health-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Content Health & Audit</h1>
          <p className="page-subtitle">Verify dynamic translations, empty fields, singleton setups, and hardcoded patterns.</p>
        </div>
        <button onClick={fetchHealthData} className="btn-secondary">
          🔄 Re-Scan System
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <span className="card-number">{summary?.issueCount || 0}</span>
          <span className="card-label">Translation Issues Found</span>
        </div>
        <div className="summary-card">
          <span className="card-number">{summary?.collections?.services || 0}</span>
          <span className="card-label">Active Services</span>
        </div>
        <div className="summary-card">
          <span className="card-number">{summary?.collections?.blogPosts || 0}</span>
          <span className="card-label">Blog Articles</span>
        </div>
        <div className="summary-card">
          <span className="card-number">{summary?.collections?.teamMembers || 0}</span>
          <span className="card-label">Team Members</span>
        </div>
      </div>

      <div className="health-grid">
        {/* Issue Listings */}
        <div className="issues-panel card-panel">
          <h2 className="panel-title">Translation & Completeness Issues ({issues.length})</h2>
          {issues.length === 0 ? (
            <div className="no-issues-state">
              🎉 All active content fields have complete English & Tamil translations!
            </div>
          ) : (
            <div className="issues-list">
              {issues.map((issue, idx) => (
                <div key={idx} className="issue-item">
                  <div className="issue-header">
                    <span className={`issue-tag ${issue.collection}`}>
                      {issue.collection?.replace('_', ' ')}
                    </span>
                    <span className="issue-id">Slug: <strong>{issue.slug || issue.id}</strong></span>
                  </div>
                  <div className="issue-body">
                    <p className="issue-desc">
                      Missing translations in fields:
                    </p>
                    <div className="missing-fields-badges">
                      {issue.missing?.map(f => (
                        <span key={f} className="field-badge">{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="issue-action">
                    <Link
                      href={`/admin-portal/website/${issue.collection === 'pages' ? 'pages' : issue.collection}`}
                      className="edit-link"
                    >
                      Fix Content &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Anomaly Resolutions Checklists */}
        <div className="anomalies-panel card-panel">
          <h2 className="panel-title">Special Content Gaps & Anomalies</h2>
          <p className="panel-desc">
            Historical hardcoding issues tracked from the original blueprint report:
          </p>
          <div className="anomalies-list">
            {anomalies.map(anomaly => (
              <div key={anomaly.key} className={`anomaly-card ${anomaly.resolved ? 'resolved' : 'unresolved'}`}>
                <div className="anomaly-status-indicator">
                  {anomaly.resolved ? '✅' : '⚠️'}
                </div>
                <div className="anomaly-details">
                  <span className="anomaly-label">{anomaly.label}</span>
                  <span className="anomaly-stat">
                    {anomaly.resolved 
                      ? `Resolved: ${anomaly.count} dynamic database document(s) detected.` 
                      : 'Pending: No active dynamic documents detected.'
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .health-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .page-title {
          font-size: 24px;
          font-weight: 800;
          color: #0F172A;
        }
        .page-subtitle {
          font-size: 14px;
          color: #64748B;
          margin-top: 4px;
        }
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .summary-card {
          background-color: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .card-number {
          font-size: 32px;
          font-weight: 800;
          color: #00A8BC;
        }
        .card-label {
          font-size: 12px;
          font-weight: 700;
          color: #64748B;
          margin-top: 4px;
          text-transform: uppercase;
        }
        .health-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }
        .panel-desc {
          font-size: 14px;
          color: #64748B;
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .no-issues-state {
          text-align: center;
          padding: 40px;
          color: #16A34A;
          font-weight: 600;
        }
        .issues-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .issue-item {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        .issue-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .issue-tag {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          width: fit-content;
          text-transform: uppercase;
        }
        .issue-tag.services { background-color: #E0F2FE; color: #0369A1; }
        .issue-tag.blog_posts { background-color: #F0FDF4; color: #166534; }
        .issue-tag.team_members { background-color: #F1F5F9; color: #475569; }
        .issue-tag.case_studies { background-color: #FAF5FF; color: #6B21A8; }
        .issue-tag.pages { background-color: #FEF3C7; color: #92400E; }

        .issue-id {
          font-size: 13px;
          color: #334155;
        }
        .issue-body {
          flex: 1;
        }
        .issue-desc {
          font-size: 12px;
          color: #64748B;
          margin-bottom: 4px;
        }
        .missing-fields-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .field-badge {
          background-color: #FEE2E2;
          color: #991B1B;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .edit-link {
          font-size: 13px;
          font-weight: 700;
          color: #00A8BC;
          text-decoration: none;
        }
        .edit-link:hover {
          color: #078696;
        }
        .anomalies-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .anomaly-card {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
        }
        .anomaly-card.resolved {
          background-color: #F0FDF4;
          border-color: #BBF7D0;
        }
        .anomaly-card.unresolved {
          background-color: #FFFBEB;
          border-color: #FEF3C7;
        }
        .anomaly-status-indicator {
          font-size: 18px;
        }
        .anomaly-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .anomaly-label {
          font-size: 13px;
          font-weight: 600;
          color: #1E293B;
        }
        .anomaly-stat {
          font-size: 11px;
          color: #64748B;
        }
      `}</style>
    </div>
  );
}
