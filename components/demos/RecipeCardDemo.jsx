'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, Reorder } from 'framer-motion';

export default function RecipeCardDemo() {
  const [recipes, setRecipes] = React.useState([
    {
      id: 1, name: 'Mediterranean Salad', image: '🥗', time: '15 min', difficulty: 'Easy',
      rating: 4.8, reviews: 234, ingredients: ['Tomatoes', 'Cucumber', 'Feta Cheese', 'Olives', 'Olive Oil'],
      saved: false, calories: 320, chef: 'Maria', servings: 2,
    },
    {
      id: 2, name: 'Grilled Salmon', image: '🐟', time: '25 min', difficulty: 'Medium',
      rating: 4.9, reviews: 567, ingredients: ['Salmon Fillet', 'Lemon', 'Garlic', 'Herbs', 'Asparagus'],
      saved: true, calories: 450, chef: 'Gordon', servings: 4,
    },
    {
      id: 3, name: 'Chocolate Lava Cake', image: '🍫', time: '30 min', difficulty: 'Hard',
      rating: 4.7, reviews: 892, ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour'],
      saved: false, calories: 580, chef: 'Pierre', servings: 6,
    },
  ]);

  const [selectedRecipe, setSelectedRecipe] = React.useState(recipes[0]);
  const [activeTab, setActiveTab] = React.useState('ingredients');
  const [checkedIngredients, setCheckedIngredients] = React.useState([]);

  const toggleSave = (id) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, saved: !r.saved } : r));
    if (selectedRecipe.id === id) setSelectedRecipe(prev => ({ ...prev, saved: !prev.saved }));
  };

  const toggleIngredient = (ingredient) => {
    setCheckedIngredients(prev => prev.includes(ingredient) ? prev.filter(i => i !== ingredient) : [...prev, ingredient]);
  };

  const difficultyColors = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };
  const difficultyGradients = {
    Easy: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.15))',
    Medium: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(249, 115, 22, 0.15))',
    Hard: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.15))',
  };

  return (
    <>
      <h2 className="demo-title">Recipe Card</h2>
      <p className="demo-subtitle">Browse recipes with ingredients, cook time, difficulty ratings, and save your favorites.</p>
      <div className="demo-area" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative' }}>
        {/* Ambient effects */}
        <div style={{ position: 'absolute', top: '15%', left: '20%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ width: '100%', maxWidth: 1350, display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 28, position: 'relative', zIndex: 1 }}
        >
        {/* Left Column - Recipe Cards */}
        <div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ marginBottom: 26 }}
          >
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 6, background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Featured Recipes
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)' }}>Discover delicious dishes to try today</p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AnimatePresence>
              {recipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30, scale: 0.95 }}
                  transition={{ delay: 0.1 + index * 0.12, type: 'spring', stiffness: 80 }}
                  onClick={() => { setSelectedRecipe(recipe); setCheckedIngredients([]); }}
                  whileHover={{ scale: 1.02, x: 8 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: 0, borderRadius: 22, cursor: 'pointer',
                    background: selectedRecipe.id === recipe.id
                      ? 'linear-gradient(145deg, rgba(102, 126, 234, 0.2), rgba(139, 92, 246, 0.15))'
                      : 'rgba(15, 15, 30, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: selectedRecipe.id === recipe.id ? '2px solid rgba(102, 126, 234, 0.35)' : '1px solid rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                    boxShadow: selectedRecipe.id === recipe.id ? '0 15px 40px rgba(102, 126, 234, 0.15)' : '0 5px 20px rgba(0,0,0,0.2)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 18, padding: 20, alignItems: 'center' }}>
                    {/* Recipe Image */}
                    <motion.div
                      whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                      style={{
                        width: 95, height: 95, borderRadius: 18, flexShrink: 0,
                        background: difficultyGradients[recipe.difficulty],
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.2rem',
                        boxShadow: `0 8px 25px ${difficultyColors[recipe.difficulty]}25`,
                        border: `1px solid ${difficultyColors[recipe.difficulty]}30`,
                      }}
                    >
                      {recipe.image}
                    </motion.div>

                    {/* Recipe Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{recipe.name}</h3>
                        {recipe.saved && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{ fontSize: '0.9rem' }}
                          >❤️</motion.span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', marginBottom: 10, flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.6)' }}>
                          ⏱️ {recipe.time}
                        </span>
                        <span style={{
                          padding: '2px 10px', borderRadius: 8,
                          background: `${difficultyColors[recipe.difficulty]}20`,
                          color: difficultyColors[recipe.difficulty], fontWeight: 600,
                        }}>
                          {recipe.difficulty}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.6)' }}>
                          🔥 {recipe.calories} cal
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(251, 191, 36, 0.15)', padding: '4px 10px', borderRadius: 10 }}>
                          <span style={{ color: '#fbbf24', fontSize: '0.85rem' }}>⭐</span>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{recipe.rating}</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                          {recipe.reviews} reviews
                        </span>
                      </div>
                    </div>

                    {/* Save Button */}
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); toggleSave(recipe.id); }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        width: 50, height: 50, borderRadius: 16, flexShrink: 0,
                        background: recipe.saved ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: recipe.saved ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.4rem', cursor: 'pointer',
                      }}
                    >
                      {recipe.saved ? '❤️' : '🤍'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}
          >
            {[
              { icon: '📚', value: recipes.length, label: 'Recipes' },
              { icon: '❤️', value: recipes.filter(r => r.saved).length, label: 'Saved' },
              { icon: '⭐', value: (recipes.reduce((s, r) => s + r.rating, 0) / recipes.length).toFixed(1), label: 'Avg Rating' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03, y: -3 }}
                style={{
                  padding: 18, borderRadius: 16, textAlign: 'center',
                  background: 'rgba(15, 15, 30, 0.6)', backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{stat.icon}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Column - Recipe Detail */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 80 }}
          style={{
            padding: 0, borderRadius: 28, overflow: 'hidden',
            background: 'rgba(15, 15, 30, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRecipe.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              {/* Hero Image Section */}
              <div style={{
                height: 260, position: 'relative', overflow: 'hidden',
                background: difficultyGradients[selectedRecipe.difficulty],
              }}>
                {/* Pattern overlay */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                <motion.div
                  style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '9rem' }}
                  animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {selectedRecipe.image}
                </motion.div>

                {/* Floating badges */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  style={{
                    position: 'absolute', top: 20, left: 20,
                    padding: '10px 18px', borderRadius: 30, background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>👨‍🍳</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Chef {selectedRecipe.chef}</span>
                </motion.div>

                <motion.div
                  onClick={() => toggleSave(selectedRecipe.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    position: 'absolute', top: 20, right: 20,
                    width: 56, height: 56, borderRadius: 18,
                    background: selectedRecipe.saved ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(15px)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
                    border: selectedRecipe.saved ? '2px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {selectedRecipe.saved ? '❤️' : '🤍'}
                </motion.div>

                {/* Rating badge */}
                <div style={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', gap: 10 }}>
                  <div style={{ padding: '10px 16px', borderRadius: 14, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#fbbf24', fontSize: '1rem' }}>⭐</span>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{selectedRecipe.rating}</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>({selectedRecipe.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: 32 }}>
                {/* Title & Stats */}
                <div style={{ marginBottom: 26 }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>{selectedRecipe.name}</h2>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {[
                      { icon: '⏱️', value: selectedRecipe.time, bg: 'rgba(102, 126, 234, 0.15)' },
                      { icon: '📊', value: selectedRecipe.difficulty, bg: `${difficultyColors[selectedRecipe.difficulty]}20`, color: difficultyColors[selectedRecipe.difficulty] },
                      { icon: '🔥', value: `${selectedRecipe.calories} cal`, bg: 'rgba(251, 146, 60, 0.15)' },
                      { icon: '🍽️', value: `${selectedRecipe.servings} servings`, bg: 'rgba(139, 92, 246, 0.15)' },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '12px 18px', borderRadius: 14, background: stat.bg,
                          border: `1px solid ${stat.color || 'rgba(255,255,255,0.08)'}40`,
                        }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>{stat.icon}</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: stat.color || '#fff' }}>{stat.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, padding: 6, background: 'rgba(255,255,255,0.03)', borderRadius: 16 }}>
                  {[
                    { id: 'ingredients', label: 'Ingredients', icon: '🥕' },
                    { id: 'instructions', label: 'Steps', icon: '📝' },
                    { id: 'nutrition', label: 'Nutrition', icon: '📊' },
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        flex: 1, padding: '14px 18px', borderRadius: 12,
                        background: activeTab === tab.id ? 'linear-gradient(135deg, #667eea, #8b5cf6)' : 'transparent',
                        border: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: activeTab === tab.id ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none',
                      }}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </motion.button>
                  ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'ingredients' && (
                    <motion.div
                      key="ingredients"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Ingredients</h3>
                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                          {checkedIngredients.length}/{selectedRecipe.ingredients.length} checked
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {selectedRecipe.ingredients.map((ingredient, index) => (
                          <motion.div
                            key={ingredient}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.06 }}
                            onClick={() => toggleIngredient(ingredient)}
                            whileHover={{ x: 6 }}
                            style={{
                              padding: '14px 18px', borderRadius: 14,
                              background: checkedIngredients.includes(ingredient) ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${checkedIngredients.includes(ingredient) ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                              display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <motion.div
                              animate={{ scale: checkedIngredients.includes(ingredient) ? 1 : 0.9 }}
                              style={{
                                width: 28, height: 28, borderRadius: 10,
                                background: checkedIngredients.includes(ingredient)
                                  ? 'linear-gradient(135deg, #22c55e, #10b981)'
                                  : 'rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.85rem', fontWeight: 700,
                                boxShadow: checkedIngredients.includes(ingredient) ? '0 4px 12px rgba(34, 197, 94, 0.3)' : 'none',
                              }}
                            >
                              {checkedIngredients.includes(ingredient) ? '✓' : ''}
                            </motion.div>
                            <span style={{
                              fontSize: '1rem', fontWeight: 500,
                              textDecoration: checkedIngredients.includes(ingredient) ? 'line-through' : 'none',
                              color: checkedIngredients.includes(ingredient) ? 'rgba(255,255,255,0.4)' : '#fff',
                            }}>
                              {ingredient}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'instructions' && (
                    <motion.div
                      key="instructions"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      style={{ padding: 30, textAlign: 'center' }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ fontSize: '4rem', marginBottom: 16 }}
                      >
                        👨‍🍳
                      </motion.div>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>Step-by-step instructions coming soon!</p>
                    </motion.div>
                  )}

                  {activeTab === 'nutrition' && (
                    <motion.div
                      key="nutrition"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}
                    >
                      {[
                        { label: 'Calories', value: selectedRecipe.calories, unit: 'kcal', color: '#f97316' },
                        { label: 'Protein', value: 24, unit: 'g', color: '#ef4444' },
                        { label: 'Carbs', value: 32, unit: 'g', color: '#fbbf24' },
                        { label: 'Fat', value: 18, unit: 'g', color: '#22c55e' },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1, type: 'spring' }}
                          style={{
                            padding: 20, borderRadius: 16, textAlign: 'center',
                            background: `${item.color}15`, border: `1px solid ${item.color}30`,
                          }}
                        >
                          <div style={{ fontSize: '2rem', fontWeight: 800, color: item.color }}>{item.value}</div>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{item.unit}</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: 4 }}>{item.label}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  style={{ display: 'flex', gap: 14, marginTop: 28 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1, padding: 20, borderRadius: 18,
                      background: 'linear-gradient(135deg, #667eea, #8b5cf6)', border: 'none',
                      color: '#fff', fontSize: '1.15rem', fontWeight: 800, cursor: 'pointer',
                      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    }}
                  >
                    <span>🍳</span> Start Cooking
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: 60, height: 60, borderRadius: 18,
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff', fontSize: '1.4rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    📤
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
      </div>
    </>
  );
}
