import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import RecipeGrid from './RecipeGrid';
import RecipeModal from './RecipeModal';
import NoResults from './NoResults';
import { ChefHat, ArrowLeft } from 'lucide-react';
import { API_BASE } from "../auth/auth.js";

export default function RecipeFinder({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  // --------------------------
  // FETCH FROM BACKEND
  // --------------------------
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/recipes`);
      const data = await res.json();
      setRecipes(data.recipes || []);
      setFilteredRecipes(data.recipes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // --------------------------
  // FILTER AND SEARCH LOGIC
  // --------------------------
  const applyFilters = (query, filter) => {
    let filtered = [...recipes];

    if (query.trim() !== '') {
      const searchTerms = query.toLowerCase().split(',').map(t => t.trim());
      filtered = filtered.filter(recipe =>
        searchTerms.some(term =>
          (recipe.ingredients || []).some(ing =>
            ing.toLowerCase().includes(term)
          ) ||
          recipe.name.toLowerCase().includes(term)
        )
      );
    }

    if (filter !== 'all') {
      filtered = filtered.filter(recipe => {
        if (filter === 'veg') return recipe.category === 'veg';
        if (filter === 'non-veg') return recipe.category === 'non-veg';
        if (filter === 'high-protein') return recipe.nutrition?.protein?.includes('g') && parseInt(recipe.nutrition.protein) > 20;
        if (filter === 'low-calorie') return recipe.calories < 400;
        return true;
      });
    }

    setFilteredRecipes(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(query, selectedFilter);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    applyFilters(searchQuery, filter);
  };

  const openRecipeDetails = (recipe) => {
    setSelectedRecipe(recipe);
    document.body.style.overflow = 'hidden';
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="recipe-finder">
      <div className="header">
        <div className="container">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <div className="header-title">
            <ChefHat className="header-icon" />
            <h1>Recipe Finder</h1>
          </div>

          <div className="search-filter-container">
            <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
            <FilterDropdown selectedFilter={selectedFilter} onFilterChange={handleFilterChange} />
          </div>

          <p className="search-tip">
            💡 Tip: Enter multiple ingredients separated by commas for better results
          </p>
        </div>
      </div>

      <div className="container main-content">
        {loading ? (
          <p style={{ color: "white" }}>Loading...</p>
        ) : filteredRecipes.length === 0 ? (
          <NoResults />
        ) : (
          <RecipeGrid recipes={filteredRecipes} onRecipeClick={openRecipeDetails} />
        )}
      </div>

      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={closeRecipeDetails} />
      )}

      {/* YOUR ORIGINAL CSS BLOCK */}
      <style>{`
        .recipe-finder {
          min-height: 100vh;
          background: linear-gradient(120deg, #0b0b0b, #181818);
          font-family: Arial, Helvetica, sans-serif;
        }

        .header {
          background: rgba(0, 0, 0, 0.9);
          padding: 2rem 0;
          border-bottom: 1px solid rgba(0, 255, 255, 0.2);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 5%;
        }

        .back-button {
          background: transparent;
          border: 2px solid cyan;
          color: cyan;
          padding: 0.7rem 1.5rem;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: rgba(0, 255, 255, 0.1);
          transform: translateX(-5px);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .header-icon {
          width: 2.5rem;
          height: 2.5rem;
          color: cyan;
        }

        .header-title h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: cyan;
        }

        .search-filter-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .search-tip {
          color: #aaa;
          font-size: 0.875rem;
        }

        .main-content {
          padding: 2rem 5%;
        }

        @media (max-width: 768px) {
          .header-title h1 {
            font-size: 2rem;
          }

          .search-filter-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
