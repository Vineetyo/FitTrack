import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ searchQuery, onSearch }) {
  return (
    <>
      <div className="search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search by ingredients (e.g., chicken, tomatoes, pasta)..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <style>{`
        .search-bar {
          position: relative;
          flex: 1;
          min-width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: cyan;
          width: 1.25rem;
          height: 1.25rem;
        }

        .search-bar input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid rgba(0, 255, 255, 0.3);
          border-radius: 12px;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
          background: rgba(0, 0, 0, 0.6);
          color: cyan;
        }

        .search-bar input::placeholder {
          color: rgba(0, 255, 255, 0.5);
        }

        .search-bar input:focus {
          border-color: cyan;
          background: rgba(0, 0, 0, 0.8);
        }

        @media (max-width: 768px) {
          .search-bar {
            min-width: 100%;
          }
        }
      `}</style>
    </>
  );
}