import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterDropdown({ selectedFilter, onFilterChange }) {
  return (
    <>
      <div className="filter-dropdown">
        <Filter className="filter-icon" />
        <select 
          value={selectedFilter} 
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="all">All Recipes</option>
          <option value="veg">Veg Only</option>
          <option value="non-veg">Non-Veg</option>
          <option value="high-protein">High Protein</option>
          <option value="low-calorie">Low Calorie</option>
        </select>
      </div>

      <style>{`
        .filter-dropdown {
          position: relative;
          min-width: 200px;
        }

        .filter-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: cyan;
          width: 1.25rem;
          height: 1.25rem;
          pointer-events: none;
        }

        .filter-dropdown select {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid rgba(0, 255, 255, 0.3);
          border-radius: 12px;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
          background: rgba(0, 0, 0, 0.6);
          color: cyan;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300ffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
        }

        .filter-dropdown select option {
          background: #0b0b0b;
          color: cyan;
        }

        .filter-dropdown select:focus {
          border-color: cyan;
          background: rgba(0, 0, 0, 0.8);
        }

        @media (max-width: 768px) {
          .filter-dropdown {
            min-width: 100%;
          }
        }
      `}</style>
    </>
  );
}