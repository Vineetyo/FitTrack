import React from 'react';
import RecipeCard from './RecipeCard';

export default function RecipeGrid({ recipes, onRecipeClick }) {
  return (
    <>
      <div className="results-count">
        <h2>Found {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}</h2>
      </div>
      
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard 
            key={recipe.id}
            recipe={recipe}
            onClick={onRecipeClick}
          />
        ))}
      </div>

      <style>{`
        .results-count {
          margin-bottom: 1.5rem;
        }

        .results-count h2 {
          color: cyan;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .recipe-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .recipe-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}