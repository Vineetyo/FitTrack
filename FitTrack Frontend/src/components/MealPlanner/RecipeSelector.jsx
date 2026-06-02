import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { API_BASE } from "../auth/auth.js";

const RecipeSelector = ({ mealType, onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch recipes from backend
  const fetchRecipes = async (q = '') => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (q) params.set('search', q);

      const res = await fetch(`${API_BASE}/api/recipes?` + params.toString());
      const data = await res.json();

      setRecipes(data.recipes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(); // initial load
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchRecipes(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>Select Recipe for {mealType}</h3>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.searchBar}>
          <Search style={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.recipeList}>
          {loading ? (
            <p style={styles.noResults}>Loading...</p>
          ) : recipes.length === 0 ? (
            <p style={styles.noResults}>No recipes found</p>
          ) : (
            recipes.map(recipe => (
              <div
                key={recipe._id}
                onClick={() => onSelect(recipe)}
                style={styles.recipeCard}
              >
                <div>
                  <h4 style={styles.recipeName}>{recipe.name}</h4>

                  <div style={styles.recipeDetails}>
                    <span style={styles.calories}>{recipe.calories} cal</span>
                    <span style={styles.badge}>{recipe.category}</span>
                  </div>
                </div>

                <div style={styles.nutrition}>
                  <span>P: {recipe.nutrition?.protein}</span>
                  <span>C: {recipe.nutrition?.carbs}</span>
                  <span>F: {recipe.nutrition?.fat}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  },
  modal: {
    background: 'rgba(26, 26, 46, 0.98)',
    border: '2px solid rgba(0, 255, 255, 0.3)',
    borderRadius: '20px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0, 255, 255, 0.4)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid rgba(0, 255, 255, 0.2)'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'cyan',
    margin: 0,
    textTransform: 'capitalize'
  },
  closeButton: {
    background: 'rgba(0, 255, 255, 0.1)',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    color: 'cyan',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  searchBar: {
    position: 'relative',
    padding: '1rem 1.5rem'
  },
  searchIcon: {
    position: 'absolute',
    left: '2.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'cyan'
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 3rem',
    background: 'rgba(0, 255, 255, 0.05)',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease'
  },
  recipeList: {
    overflowY: 'auto',
    padding: '1rem 1.5rem',
    flex: 1
  },
  noResults: {
    textAlign: 'center',
    color: '#888',
    fontSize: '1rem',
    padding: '2rem'
  },
  recipeCard: {
    background: 'rgba(0, 255, 255, 0.05)',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  recipeName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 0.5rem 0'
  },
  recipeDetails: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  calories: {
    color: 'cyan',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  badge: {
    background: 'rgba(0, 255, 255, 0.2)',
    color: 'cyan',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  nutrition: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    fontSize: '0.8rem',
    color: '#aaa',
    textAlign: 'right'
  }
};

export default RecipeSelector;
