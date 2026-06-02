import React from 'react';
import { X, Clock, Users } from 'lucide-react';

export default function RecipeModal({ recipe, onClose }) {
  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <img src={recipe.image} alt={recipe.name} />
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>
            <div className="modal-header-overlay">
              <h2>{recipe.name}</h2>
              <div className="modal-header-meta">
                <span className="badge">{recipe.difficulty}</span>
                <span>{recipe.calories} cal</span>
              </div>
            </div>
          </div>

          <div className="modal-body">
            <div className="quick-info">
              <div className="quick-info-item">
                <Clock size={24} />
                <div className="label">Prep Time</div>
                <div className="value">{recipe.prepTime}</div>
              </div>
              <div className="quick-info-item">
                <Clock size={24} />
                <div className="label">Cook Time</div>
                <div className="value">{recipe.cookTime}</div>
              </div>
              <div className="quick-info-item">
                <Users size={24} />
                <div className="label">Servings</div>
                <div className="value">{recipe.servings}</div>
              </div>
            </div>

            <div className="section">
              <h3>Description</h3>
              <p>{recipe.description}</p>
            </div>

            <div className="section">
              <h3>Ingredients</h3>
              <div className="ingredients-grid">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-item">
                    <span className="bullet">•</span>
                    <span>{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <h3>Instructions</h3>
              <ol className="instructions-list">
                {recipe.instructions.map((step, index) => (
                  <li key={index}>
                    <span className="step-number">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="section nutrition-section">
              <h3>Nutrition Information</h3>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <div className="label">Protein</div>
                  <div className="value">{recipe.nutrition.protein}</div>
                </div>
                <div className="nutrition-item">
                  <div className="label">Carbs</div>
                  <div className="value">{recipe.nutrition.carbs}</div>
                </div>
                <div className="nutrition-item">
                  <div className="label">Fat</div>
                  <div className="value">{recipe.nutrition.fat}</div>
                </div>
                <div className="nutrition-item">
                  <div className="label">Fiber</div>
                  <div className="value">{recipe.nutrition.fiber}</div>
                </div>
              </div>
            </div>

            <button className="close-modal-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>

<style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.2s ease-out;
}
          .modal-content {
      background: rgba(26, 26, 46, 0.98);
      border-radius: 24px;
      max-width: 900px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 255, 255, 0.4);
      border: 2px solid rgba(0, 255, 255, 0.3);
      animation: slideUp 0.3s ease-out;
    }

    .modal-header {
      position: relative;
      height: 300px;
    }

    .modal-header img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .close-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
      transition: all 0.2s ease;
      z-index: 10;
    }

    .close-button:hover {
      background: #00ffff;
      transform: scale(1.1);
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
    }

    .close-button svg {
      color: #0a0e27;
    }

    .modal-header-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(10, 14, 39, 0.95), transparent);
      padding: 2rem;
      color: #00ffff;
    }

    .modal-header-overlay h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
    }

    .modal-header-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.95rem;
    }

    .badge {
      background: rgba(0, 255, 255, 0.3);
      backdrop-filter: blur(10px);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      border: 1px solid rgba(0, 255, 255, 0.5);
    }

    .modal-body {
      padding: 2rem;
    }

    .quick-info {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
      background: rgba(0, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 16px;
      border: 1px solid rgba(0, 255, 255, 0.2);
    }

    .quick-info-item {
      text-align: center;
    }

    .quick-info-item svg {
      color: #00ffff;
      margin: 0 auto 0.5rem;
      filter: drop-shadow(0 0 8px #00ffff);
    }

    .quick-info-item .label {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 0.25rem;
    }

    .quick-info-item .value {
      font-weight: 700;
      color: #00ffff;
      font-size: 1.125rem;
      text-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
    }

    .section {
      margin-bottom: 2rem;
    }

    .section h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #00ffff;
      margin-bottom: 1rem;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }

    .section p {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.7;
      font-size: 1rem;
    }

    .ingredients-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.75rem;
    }

    .ingredient-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(0, 255, 255, 0.05);
      padding: 0.75rem 1rem;
      border-radius: 10px;
      transition: all 0.2s ease;
      border: 1px solid rgba(0, 255, 255, 0.2);
    }

    .ingredient-item:hover {
      background: rgba(0, 255, 255, 0.1);
      transform: translateX(4px);
      border-color: #00ffff;
    }

    .ingredient-item .bullet {
      color: #00ffff;
      font-size: 1.5rem;
      font-weight: 700;
      text-shadow: 0 0 8px rgba(0, 255, 255, 0.8);
    }

    .ingredient-item span:last-child {
      color: rgba(255, 255, 255, 0.9);
      text-transform: capitalize;
      font-weight: 500;
    }

    .instructions-list {
      list-style: none;
      counter-reset: step-counter;
    }

    .instructions-list li {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      counter-increment: step-counter;
    }

    .step-number {
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      background: linear-gradient(135deg, #00ffff 0%, #00d4ff 100%);
      color: #0a0e27;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
    }

    .instructions-list li > span:last-child {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.7;
      padding-top: 0.25rem;
    }

    .nutrition-section {
      background: rgba(0, 255, 255, 0.05);
      padding: 1.5rem;
      border-radius: 16px;
      border: 1px solid rgba(0, 255, 255, 0.2);
    }

    .nutrition-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1.5rem;
    }

    .nutrition-item {
      text-align: center;
    }

    .nutrition-item .label {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 0.5rem;
    }

    .nutrition-item .value {
      font-weight: 700;
      color: #00ffff;
      font-size: 1.25rem;
      text-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
    }

    .close-modal-button {
      width: 100%;
      background: linear-gradient(135deg, #00ffff 0%, #00d4ff 100%);
      color: #0a0e27;
      border: none;
      padding: 1rem;
      border-radius: 12px;
      font-size: 1.125rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(0, 255, 255, 0.4);
    }

    .close-modal-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 30px rgba(0, 255, 255, 0.6);
    }

    .close-modal-button:active {
      transform: translateY(0);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-content::-webkit-scrollbar {
      width: 8px;
    }

    .modal-content::-webkit-scrollbar-track {
      background: rgba(26, 26, 46, 0.5);
    }

    .modal-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #00ffff 0%, #00d4ff 100%);
      border-radius: 10px;
    }

    .modal-content::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #00d4ff 0%, #00a4cc 100%);
    }

    @media (max-width: 768px) {
      .modal-header {
        height: 200px;
      }

      .modal-header-overlay h2 {
        font-size: 1.75rem;
      }

      .quick-info {
        grid-template-columns: 1fr;
      }

      .ingredients-grid {
        grid-template-columns: 1fr;
      }

      .nutrition-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `}</style>
    </>
  );
}