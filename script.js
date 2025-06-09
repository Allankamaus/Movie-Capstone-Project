const TMDB_API_KEY = 'ed1fe23f4da97b95e5b73a1438254d09';
const searchForm = document.querySelector('.search-form');
const searchBar = document.getElementById('search-bar');
const movieInfo = document.getElementById('movie-info-placeholder');
const suggestionsBox = document.getElementById('suggestions');
let debounceTimeout = null;


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
    movieInfo.innerHTML = '<p>Searching...</p>';
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`)
        .then(res => res.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                showSearchResults(data.results);
            } else {
                movieInfo.innerHTML = `<p>Movie not found.</p>`;
            }
        })
        .catch(() => {
            movieInfo.innerHTML = '<p>Error fetching movie data.</p>';
        });
}

function showSearchResults(movies) {
    movieInfo.innerHTML = movies.map(movie => `
        <div class="search-result" data-id="${movie.id}" style="margin-bottom:24px;cursor:pointer;">
            <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w200' + movie.poster_path : ''}" alt="Poster" style="max-width:80px;vertical-align:middle;margin-right:16px;">
            <span style="font-size:1.2em;">${movie.title} (${movie.release_date ? movie.release_date.substring(0,4) : ''})</span>
        </div>
    `).join('');
    document.querySelectorAll('.search-result').forEach(item => {
        item.addEventListener('click', function() {
            const movieId = this.getAttribute('data-id');
            getMovieDetails(movieId);
        });
    });
}

function getMovieDetails(movieId) {
    movieInfo.innerHTML = '<p>Loading...</p>';
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
    movieInfo.innerHTML = `
        <h2>${data.title} (${data.release_date ? data.release_date.substring(0,4) : ''})</h2>
        <img src="${data.poster_path ? 'https://image.tmdb.org/t/p/w200' + data.poster_path : ''}" alt="Poster" style="max-width:120px;float:left;margin-right:16px;">
        <p><strong>Genre:</strong> ${data.genres ? data.genres.map(g => g.name).join(', ') : ''}</p>
        <p><strong>Plot:</strong> ${data.overview}</p>
        <p><strong>TMDB Rating:</strong> ${data.vote_average}</p>
        <div style="clear:both"></div>
        <button id="add-favourite">Add to Favourites</button>
        <button id="add-watchlist">Add to Watchlist</button>
    `;
    document.getElementById('add-favourite').onclick = function() {
        fetch('http://localhost:3001/api/favourites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                movie_id: data.id,
                title: data.title,
                description: data.overview
            })
        }).then(res => res.json()).then(res => {
            alert('Added to favourites!');
        });
    };
    document.getElementById('add-watchlist').onclick = function() {
        fetch('http://localhost:3001/api/watchlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                movie_id: data.id,
                title: data.title,
                description: data.overview
            })
        }).then(res => res.json()).then(res => {
            alert('Added to watchlist!');
        });
    };
}

function showSuggestions(movies) {
    suggestionsBox.innerHTML = movies.map(movie =>
        `<div class="suggestion-item" data-id="${movie.id}">
            ${movie.title} (${movie.release_date ? movie.release_date.substring(0,4) : ''})
        </div>`
    ).join('');
    suggestionsBox.style.display = 'block';
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const movieId = this.getAttribute('data-id');
            suggestionsBox.innerHTML = '';
            suggestionsBox.style.display = 'none';
            getMovieDetails(movieId);
        });
    });
}

// Test TMDb API connection
fetch(`https://api.themoviedb.org/3/movie/550?api_key=${TMDB_API_KEY}`)
    .then(res => res.json())
    .then(data => {
        console.log('TMDb API test result:', data);
    })
    .catch(err => {
        console.error('TMDb API connection error:', err);
    });