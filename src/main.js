import "./style.css";
import { fetchBooks } from "./fetchBooks.js";
import { addFavourite, getFavourites, removeFavourite } from "./favourites.js";

const booksGrid = document.querySelector("#books-grid");
const searchStatus = document.querySelector("#search-status");
const searchForm = document.querySelector("#book-search-form");
const searchInput = document.querySelector("#book-search");
const favouritesList = document.querySelector("#favourites-list");

function createBookCard(book, isFavourite = false) {
  const article = document.createElement("article");
  article.className =
    "rounded-xl border border-forest-green/15 bg-amber-50 p-4";

  if (book.coverId) {
    const cover = document.createElement("img");
    cover.src = `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`;
    cover.alt = `Cover of ${book.title}`;
    cover.className = "h-52 w-full rounded-lg object-cover";
    article.append(cover);
  } else {
    const cover = document.createElement("div");
    cover.className =
      "flex h-52 items-end rounded-lg bg-forest-green p-4 text-maximum-yellow";
    cover.textContent = "Cover unavailable";
    article.append(cover);
  }

  const title = document.createElement("h2");
  title.className = "mt-4 text-lg font-bold text-forest-green";
  title.textContent = book.title;

  const author = document.createElement("p");
  author.className = "mt-1 text-sm text-stone-600";
  author.textContent = book.author;

  const button = document.createElement("button");
  button.type = "button";

  if (isFavourite) {
    button.className =
      "mt-4 rounded-lg border border-forest-green px-4 py-2 text-sm font-semibold text-forest-green";
    button.textContent = "Remove from favourites";
    button.dataset.removeFavourite = book.id;
  } else {
    button.className =
      "mt-4 rounded-lg bg-forest-green px-4 py-2 text-sm font-semibold text-maximum-yellow";
    button.textContent = "Add to favourites";
    button.dataset.addFavourite = "";
    button.dataset.id = book.id;
    button.dataset.title = book.title;
    button.dataset.author = book.author;
    button.dataset.coverId = book.coverId ?? "";
  }

  const detailsLink = document.createElement("a");
  detailsLink.href = `https://openlibrary.org${book.id}`;
  detailsLink.target = "_blank";
  detailsLink.rel = "noopener noreferrer";
  detailsLink.textContent = "View on Open Library ↗";
  detailsLink.className =
    "mt-3 block text-sm font-semibold text-forest-green underline";

  article.append(title, author, detailsLink, button);
  return article;
}

function renderFavourites() {
  if (!favouritesList) return;

  const books = getFavourites();

  if (books.length === 0) {
    favouritesList.innerHTML = `
      <div class="rounded-xl border border-forest-green/15 bg-amber-50 p-8 text-center">
        <p class="text-stone-600">
          Your reading list is waiting for its first story.
        </p>
        <a
          href="./index.html#books"
          class="mt-4 inline-flex rounded-lg bg-forest-green px-5 py-3 font-semibold text-maximum-yellow"
        >
          Browse books
        </a>
      </div>
    `;
    return;
  }

  favouritesList.replaceChildren(
    ...books.map((book) => createBookCard(book, true)),
  );
}
async function loadBooks(query = "Biography") {
  if (!booksGrid) return;

  searchStatus.innerHTML = `
    <span class="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        class="h-4 w-4 animate-spin rounded-full border-2 border-forest-green/30 border-t-forest-green"
      ></span>
      <span>Loading books...</span>
    </span>
  `;

  booksGrid.replaceChildren();

  try {
    const books = await fetchBooks(query);

    if (books.length === 0) {
      searchStatus.textContent = "No results found. Try another search.";
      return;
    }

    booksGrid.replaceChildren(...books.map((book) => createBookCard(book)));
    searchStatus.textContent = `Found ${books.length} books for "${query}".`;
  } catch (error) {
    console.error("Could not load books:", error);

    searchStatus.textContent =
      "Could not load books. Check your connection, then ";

    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.textContent = "Try again";
    retryButton.className =
      "ml-2 rounded-lg bg-forest-green px-3 py-1 text-sm font-semibold text-maximum-yellow hover:brightness-90";
    retryButton.addEventListener("click", () => loadBooks(query));

    searchStatus.append(retryButton);
  }
}

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();
  if (query) loadBooks(query);
});

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-favourite]");

  if (addButton) {
    const added = addFavourite({
      id: addButton.dataset.id,
      title: addButton.dataset.title,
      author: addButton.dataset.author,
      coverId: addButton.dataset.coverId
        ? Number(addButton.dataset.coverId)
        : null,
    });

    addButton.textContent = added
      ? "Added to favourites"
      : "Already in favourites";
    addButton.disabled = true;
    return;
  }

  const removeButton = event.target.closest("[data-remove-favourite]");

  if (removeButton) {
    removeFavourite(removeButton.dataset.removeFavourite);
    renderFavourites();
  }
});

renderFavourites();
loadBooks();
