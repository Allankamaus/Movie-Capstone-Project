const OMDB_API_KEY = 'ed1fe23f4da97b95e5b73a1438254d09';
const searchForm = document.querySelector('.search-form');
const searchBar = document.getElementById('search-bar');
const videoPlaceholder = document.getElementById('video-player-placeholder');
const movieInfo = document.getElementById('movie-info-placeholder');

// Hide video player placeholder initially
videoPlaceholder.style.display = 'none';

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchBar.value.trim();
    if (!query) return;
    fetchMovie(query);
});

function fetchMovie(title) {
    // Hide video player until a movie is found
    videoPlaceholder.style.display = 'none';
    movieInfo.innerHTML = '<p>Searching...</p>';
    fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`)
        .then(res => res.json())
        .then(data => {
            if (data.Response === 'True') {
                showMovie(data);
            } else {
                movieInfo.innerHTML = `<p>Movie not found.</p>`;
            }
        })
        .catch(() => {
            movieInfo.innerHTML = '<p>Error fetching movie data.</p>';
        });
}

function showMovie(data) {
    // Show video player placeholder
    videoPlaceholder.style.display = 'flex';
    // Display movie info
    movieInfo.innerHTML = `
        <h2>${data.Title} (${data.Year})</h2>
        <img src="${data.Poster !== 'N/A' ? data.Poster : ''}" alt="Poster" style="max-width:120px;float:left;margin-right:16px;">
        <p><strong>Genre:</strong> ${data.Genre}</p>
        <p><strong>Plot:</strong> ${data.Plot}</p>
        <p><strong>IMDB Rating:</strong> ${data.imdbRating}</p>
        <div style="clear:both"></div>
    `;
    // Optionally, you could embed a trailer or video here if available
    // For now, the video player is just a placeholder
}