import React from 'react';
import { Clock, Users, Flame } from 'lucide-react';

export default function RecipeCard({ recipe, onClick }) {
  return (
    <>
      <div className="recipe-card" onClick={() => onClick(recipe)}>
        <div className="recipe-image">
          <img src={recipe.image} alt={recipe.name} />
          <div className="difficulty-badge">{recipe.difficulty}</div>
        </div>
        
        <div className="recipe-content">
          <h3>{recipe.name}</h3>
          <p className="recipe-description">{recipe.description}</p>
          
          <div className="recipe-meta">
            <div className="meta-item">
              <Clock size={16} />
              <span>{recipe.prepTime}</span>
            </div>
            <div className="meta-item">
              <Users size={16} />
              <span>{recipe.servings}</span>
            </div>
            <div className="meta-item">
              <Flame size={16} />
              <span>{recipe.calories}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .recipe-card {
          background: rgba(0, 0, 0, 0.6);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid rgba(0, 255, 255, 0.2);
        }

        .recipe-card:hover {
          transform: translateY(-8px);
          border-color: cyan;
        }

        .recipe-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .recipe-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .recipe-card:hover .recipe-image img {
          transform: scale(1.1);
        }

        .difficulty-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: cyan;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #000;
        }

        .recipe-content {
          padding: 1.5rem;
        }

        .recipe-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: cyan;
          margin-bottom: 0.75rem;
          transition: color 0.3s ease;
        }

        .recipe-description {
          color: #c8c8c8;
          font-size: 0.95rem;
          margin-bottom: 1rem;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .recipe-meta {
          display: flex;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(0, 255, 255, 0.2);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #c8c8c8;
          font-size: 0.875rem;
        }

        .meta-item svg {
          color: cyan;
        }
      `}</style>
    </>
  );
}