const API_URL = 'https://openlibrary.org/search.json';

export async function fetchBooks(query = 'Biography') {
  const params = new URLSearchParams({
    q: query,
    fields: 'key,title,author_name,cover_i',
    limit: '12',
  });

  const response = await fetch(`${API_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Book search failed: ${response.status}`);
  }

  const data = await response.json();

  return data.docs.map((book) => ({
    id: book.key,
    title: book.title,
    author: book.author_name?.[0] ?? 'Unknown author',
    coverId: book.cover_i ?? null,
  }));
}