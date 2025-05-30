const TMDB_API_KEY = 'ed1fe23f4da97b95e5b73a1438254d09';
const searchForm = document.querySelector('.search-form');
const searchBar = document.getElementById('search-bar');
const videoPlaceholder = document.getElementById('video-player-placeholder');
const movieInfo = document.getElementById('movie-info-placeholder');
const suggestionsBox = document.getElementById('suggestions');
let debounceTimeout = null;

// Hide video player placeholder initially
videoPlaceholder.style.display = 'none';

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchBar.value.trim();
    if (!query) return;
    fetchMovie(query);
});

searchBar.addEventListener('input', function() {
    const query = searchBar.value.trim();
    clearTimeout(debounceTimeout);
    if (!query) {
        suggestionsBox.innerHTML = '';
        suggestionsBox.style.display = 'none';
        return;
    }
    debounceTimeout = setTimeout(() => fetchSuggestions(query), 300);
});

function fetchMovie(title) {
    videoPlaceholder.style.display = 'none';
    movieInfo.innerHTML = '<p>Searching...</p>';
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`)
        .then(res => res.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                getMovieDetails(data.results[0].id);
            } else {
                movieInfo.innerHTML = `<p>Movie not found.</p>`;
            }
        })
        .catch(() => {
            movieInfo.innerHTML = '<p>Error fetching movie data.</p>';
        });
}

function getMovieDetails(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`)
        .then(res => res.json())
        .then(data => {
            showMovie(data);
        })
        .catch(() => {
            movieInfo.innerHTML = '<p>Error fetching movie details.</p>';
        });
}

function fetchSuggestions(query) {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                showSuggestions(data.results);
            } else {
                suggestionsBox.innerHTML = '';
                suggestionsBox.style.display = 'none';
            }
        })
        .catch(() => {
            suggestionsBox.innerHTML = '';
            suggestionsBox.style.display = 'none';
        });
}

function showMovie(data) {
    videoPlaceholder.style.display = 'flex';
    movieInfo.innerHTML = `
        <h2>${data.title} (${data.release_date ? data.release_date.substring(0,4) : ''})</h2>
        <img src="${data.poster_path ? 'https://image.tmdb.org/t/p/w200' + data.poster_path : ''}" alt="Poster" style="max-width:120px;float:left;margin-right:16px;">
        <p><strong>Genre:</strong> ${data.genres ? data.genres.map(g => g.name).join(', ') : ''}</p>
        <p><strong>Plot:</strong> ${data.overview}</p>
        <p><strong>TMDB Rating:</strong> ${data.vote_average}</p>
        <div style="clear:both"></div>
    `;
}

function showSuggestions(movies) {
    suggestionsBox.innerHTML = movies.map(movie =>
        `<div class="suggestion-item" data-id="${movie.id}">
            ${movie.title} (${movie.release_date ? movie.release_date.substring(0,4) : ''})
        </div>`
    ).join('');
    suggestionsBox.style.display = 'block';
}

suggestionsBox.addEventListener('click', function(e) {
    if (e.target.classList.contains('suggestion-item')) {
        const movieId = e.target.getAttribute('data-id');
        suggestionsBox.innerHTML = '';
        suggestionsBox.style.display = 'none';
        getMovieDetails(movieId);
    }
});