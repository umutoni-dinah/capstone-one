import './style.css';
import {
  addFavourite,
  getFavourites,
  removeFavourite,
} from './favourites.js';

const favouritesList = document.querySelector('#favourites-list');

function renderFavourites() {
  if (!favouritesList) return;

  const cards = getFavourites().map((book) => {
    const article = document.createElement('article');
    article.className = 'rounded-xl border border-forest-green/15 bg-white p-4';

    const title = document.createElement('h2');
    title.className = 'text-lg font-bold text-forest-green';
    title.textContent = book.title;

    const author = document.createElement('p');
    author.className = 'mt-1 text-sm text-stone-600';
    author.textContent = book.author;

    const button = document.createElement('button');
    button.type = 'button';
    button.className =
      'mt-4 rounded-lg border border-forest-green px-4 py-2 text-sm font-semibold text-forest-green';
    button.textContent = 'Remove from favourites';
    button.dataset.removeFavourite = book.id;

    article.append(title, author, button);
    return article;
  });

  favouritesList.replaceChildren(...cards);
}

document.addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-add-favourite]');

  if (addButton) {
    const added = addFavourite({
      id: addButton.dataset.id,
      title: addButton.dataset.title,
      author: addButton.dataset.author,
    });

    addButton.textContent = added
      ? 'Added to favourites'
      : 'Already in favourites';
    addButton.disabled = true;
    return;
  }

  const removeButton = event.target.closest('[data-remove-favourite]');

  if (removeButton) {
    removeFavourite(removeButton.dataset.removeFavourite);
    renderFavourites();
  }
});

renderFavourites();