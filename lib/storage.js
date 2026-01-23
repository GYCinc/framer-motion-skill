// LocalStorage helpers for rating persistence

export const getRating = (id) => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(`demo_rating_${id}`);
};

export const setRating = (id, rating) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`demo_rating_${id}`, rating);
};

export const getAllRatings = () => {
  if (typeof window === 'undefined') return {};

  const ratings = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('demo_rating_')) {
      const id = key.replace('demo_rating_', '');
      ratings[id] = localStorage.getItem(key);
    }
  }
  return ratings;
};

export const clearAllRatings = () => {
  if (typeof window === 'undefined') return;

  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('demo_rating_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
};
