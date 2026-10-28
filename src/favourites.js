const STORAGE_KEY = 'book-explorer-favourites';

function loadFavourites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

let favourites = loadFavourites();

function saveFavourites() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
}

export function addFavourite(book) {
  if (favourites.some((item) => item.id === book.id)) return false;

  favourites.push(book);
  saveFavourites();
  return true;
}

export function removeFavourite(id) {
  favourites = favourites.filter((book) => book.id !== id);
  saveFavourites();
}

export function getFavourites() {
  return [...favourites];
}