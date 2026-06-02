import React from 'react';

export default function NoResults() {
  return (
    <>
      <div className="no-results">
        <div className="no-results-icon">🔍</div>
        <h3>No recipes found</h3>
        <p>Try searching with different ingredients or filters</p>
      </div>

      <style>{`
        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          color: cyan;
        }

        .no-results-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .no-results h3 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .no-results p {
          font-size: 1.125rem;
          color: #aaa;
        }
      `}</style>
    </>
  );
}