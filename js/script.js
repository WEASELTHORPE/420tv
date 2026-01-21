let spinner;

document.addEventListener('DOMContentLoaded', () => {
  spinner = document.getElementById('spinner');
});


function hideSpinner() {
  spinner.classList.add('hidden');
}


function showSpinner() {
  spinner.classList.remove('hidden');
}



let currentPage = 1;
let currentMode = 'popular'; // 'popular' | 'genre' | 'search'
let selectedGenreId = null;
let currentQuery = '';



//let currentPage = 1;

// DOM elements
const movieGrid = document.getElementById('movie-grid');
const loadMoreBtn = document.getElementById('load-more');
const toggleDarkBtn = document.getElementById('toggle-dark');
const searchInput = document.getElementById('search-input');



// Render movies to the grid

function renderMovies(movies) {
  movies.forEach(show => {
    if (!show.poster_path) return;

    const card = document.createElement('div');
    card.className = 'bg-gray-100 dark:bg-gray-800 p-2 rounded cursor-pointer hover:scale-105 transition';

    card.innerHTML = `
      <img class="w-full h-65 object-cover rounded"
           src="${IMAGE_BASE + show.poster_path}"
           alt="${show.name}" />
      <h3 class="mt-2 text-center text-lg font-semibold">
        ${show.name}
      </h3>
    `;

    card.addEventListener('click', () => {
      window.location.href = `tv.html?id=${show.id}`;
    });

    movieGrid.appendChild(card);
  });
}

async function loadInitialMovies() {
  showSpinner();
  const movies = await fetchPopularMovies(1);
  hideSpinner();

  movieGrid.innerHTML = '';
  renderMovies(movies);
}



// Load initial movies
async function fetchPopularMovies(page = 1) {
  const url = `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}



// Load more movies
loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  showSpinner();

  let movies = [];

  if (currentMode === 'popular') {
    movies = await fetchPopularMovies(currentPage);
  }

  if (currentMode === 'genre') {
    movies = await fetchMoviesByGenre(selectedGenreId, currentPage);
  }

  if (currentMode === 'search') {
    movies = await searchMovies(currentQuery, currentPage);
  }

  hideSpinner();

  if (movies.length === 0) {
    loadMoreBtn.style.display = 'none';
    return;
  }

  renderMovies(movies);
});



// Dark mode toggle
toggleDarkBtn.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Persist dark mode preference
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
});

const genreContainer = document.getElementById('genre-filters');
//let selectedGenreId = null;

// Fetch genre list and render buttons
async function fetchGenres() {
  const res = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`);
  const data = await res.json();
  renderGenreButtons(data.genres);
}

// Render genre filter buttons
function renderGenreButtons(genres) {
  genres.forEach(genre => {
    const btn = document.createElement('button');
    btn.textContent = genre.name;
    btn.className =
      'px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-blue-500 hover:text-white transition';

    btn.addEventListener('click', async () => {
      // Toggle off
      if (selectedGenreId === genre.id) {
        selectedGenreId = null;
        currentMode = 'popular';
        currentPage = 1;

        genreContainer.querySelectorAll('button').forEach(b =>
          b.classList.remove('bg-blue-600', 'text-white')
        );

        movieGrid.innerHTML = '';
        loadMoreBtn.style.display = 'inline-block';
        loadInitialMovies();
        return;
      }

      // Select genre
      selectedGenreId = genre.id;
      currentMode = 'genre';
      currentPage = 1;

      genreContainer.querySelectorAll('button').forEach(b =>
        b.classList.remove('bg-blue-600', 'text-white')
      );
      btn.classList.add('bg-blue-600', 'text-white');

      showSpinner();
      const movies = await fetchMoviesByGenre(selectedGenreId, currentPage);
      hideSpinner();

      movieGrid.innerHTML = '';
      renderMovies(movies);
      loadMoreBtn.style.display = 'inline-block';
    });

    genreContainer.appendChild(btn);
  });
}


// Fetch movies by genre
async function fetchMoviesByGenre(genreId, page = 1) {
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}


// Load genres on page load
fetchGenres();

// Handle Search
searchInput.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    const query = e.target.value.trim();

    movieGrid.innerHTML = '';
    currentPage = 1;

    if (!query) {
      currentMode = 'popular';
      loadMoreBtn.style.display = 'inline-block';
      loadInitialMovies();
      return;
    }

    currentMode = 'search';
    currentQuery = query;

    showSpinner();
    const results = await searchMovies(currentQuery, currentPage);
    hideSpinner();

    if (results.length === 0) {
      movieGrid.innerHTML =
        '<p class="col-span-full text-center text-gray-500 dark:text-gray-400">No shows found.</p>';
      loadMoreBtn.style.display = 'none';
      return;
    }

    renderMovies(results);
    loadMoreBtn.style.display = 'inline-block';
  }
});


// Search API function
async function searchMovies(query, page = 1) {
  const url = `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}




document.addEventListener('DOMContentLoaded', () => {
  loadInitialMovies();   // 🔥 This loads popular movies when page opens
  fetchGenres();         // 🔥 This loads genre buttons
});
