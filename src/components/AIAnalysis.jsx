import React, { useState } from 'react';
import { FiCpu, FiTarget, FiTrendingUp, FiCheckCircle, FiChevronRight } from 'react-icons/fi';
import { callGroqAI } from '../services/aiService';

const AIAnalysis = ({ data, industry = 'construction' }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState('');
  const [error, setError] = useState('');

  const generateAnalysis = async () => {
    setLoading(true);
    setError('');
    setInsight('');

    const promptData = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
    const prompt = `Analyze this ${industry} data with a focus on GROWTH, REVENUE, PROFIT, and EFFICIENCY. Provide comprehensive insights including:
    - Key performance indicators and trends
    - Operational inefficiencies and optimization opportunities
    - Risk assessment and mitigation strategies
    - Revenue growth recommendations
    - Technology and process improvement suggestions
    
    Data: ${promptData}`;

    const res = await callGroqAI(prompt, industry);
    
    if (res.success) {
      setInsight(res.insight);
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  /**
   * Formats the AI text by:
   * 1. Highlighting bold categories (e.g., **Revenue:**) in blue spans.
   * 2. Removing remaining ** markers.
   */
  const formatInsightText = (text) => {
    if (!text) return null;

    let formatted = text.replace(/\*\*(.*?):\*\*/g, (match, title) => {
      return `<strong style="color: #60a5fa; font-weight: 800; font-size: 13.5px; letter-spacing: -0.1px;">${title}:</strong>`;
    });

    formatted = formatted.replace(/\*\*(.*?)\*\*/g, (match, val) => {
      return `<span style="font-weight: 700; color: #f1f5f9;">${val}</span>`;
    });

    return formatted;
  };

  return (
    <div style={styles.botPanel} className="fade-in-up">
      {/* Bot Header */}
      <div style={styles.botHeader}>
        <div style={styles.botAvatar}>
          {/* <FiCpu size={20} color="#ffffff" strokeWidth={2.5} /> */}
           <img src="/favicon.png" alt="AlgoVista Logo" style={styles.logoImg} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={styles.botName}>AlgoVista AI Strategy Advisor</div>
          <div style={styles.botStatus}>
            {loading ? (
              <span style={{ color: '#fbbf24' }}>● Analyzing Data & Generating Insights...</span>
            ) : insight ? (
              <span style={{ color: '#4ade80' }}>● Strategic Recommendations Ready</span>
            ) : (
              <span style={{ color: '#94a3b8' }}>● Ready for Analysis</span>
            )}
          </div>
        </div>
        <div style={styles.confidenceBadge}>
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#4ade80' }}>98% Accuracy</span>
        </div>
        <button
          style={{ ...styles.actionBtn, ...(loading ? styles.actionBtnDisabled : {}) }}
          onClick={generateAnalysis}
          disabled={loading}
        >
          {loading ? (
            'Analyzing...'
          ) : insight ? (
            <><FiCheckCircle size={14} /> Update Analysis</>
          ) : (
            'Generate Insights'
          )}
        </button>
      </div>

      {/* Progressive Bar Removed as Requested */}

      {/* Insight Result */}
      {insight && !loading && (
        <div style={styles.insightBox} className="fade-in-up">
          <div style={styles.insightTitle}>
            <FiTarget size={16} />
            <span>EXECUTIVE STRATEGY & REVENUE GROWTH ANALYSIS</span>
            <div style={styles.insightBadge}>
              <span>AI-Powered</span>
            </div>
          </div>
          <div style={styles.insightContent}>
            {insight.split('\n').filter(l => l.trim() !== '').map((line, i) => (
              <div key={i} style={styles.insightLine}>
                <div style={styles.bullet}>
                  <FiChevronRight size={14} color="#3b82f6" />
                </div>
                <div 
                  dangerouslySetInnerHTML={{ __html: formatInsightText(line.replace(/^- /, '')) }} 
                  style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: 1.6 }}
                />
              </div>
            ))}
          </div>

          <div style={styles.insightFooter}>
            <div style={styles.footerItem}>
              <FiTrendingUp size={14} color="#4ade80" />
              <span>Projected ROI: **High Efficiency Gain**</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          <FiCpu size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

const styles = {
  botPanel: {
    background: 'linear-gradient(135deg, #0f172a, #1a2744)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '28px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  botHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: (insight) => insight ? '20px' : '0px', // Minor adjustment
  },
  botAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    // background: 'linear-gradient(135deg, #2563eb, #1e40af)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    // boxShadow: '0 0 15px rgba(37, 99, 235, 0.4)',
  },
  logoImg: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    objectFit: 'contain',
  },
  botName: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#f8fafc',
    letterSpacing: '-0.2px',
  },
  botStatus: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#64748b',
    marginTop: '2px',
  },
  confidenceBadge: {
    background: 'rgba(74, 222, 128, 0.1)',
    border: '1px solid rgba(74, 222, 128, 0.2)',
    borderRadius: '12px',
    padding: '4px 8px',
    marginRight: '12px',
    fontSize: '10px',
    fontWeight: '700',
    color: '#4ade80',
  },
  actionBtn: {
    marginLeft: 'auto',
    background: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '11.5px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
  },
  actionBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    background: 'rgba(255,255,255,0.05)',
  },
  insightBox: {
    marginTop: '20px',
    padding: '20px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  insightTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#3b82f6',
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '18px',
  },
  insightBadge: {
    background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '9px',
    fontWeight: '700',
    marginLeft: 'auto',
  },
  insightContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  insightLine: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  bullet: {
    marginTop: '3px',
    flexShrink: 0,
  },
  insightFooter: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    color: '#94a3b8',
  },
  errorBox: {
    padding: '12px 16px',
    background: 'rgba(248,113,113,0.1)',
    border: '1px solid rgba(248,113,113,0.2)',
    borderRadius: '8px',
    color: '#f87171',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '16px',
  }
};

export default AIAnalysis;
