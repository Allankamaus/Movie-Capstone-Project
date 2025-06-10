document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3001/api/favourites')
        .then(res => res.json())
        .then(movies => {
            const favList = document.getElementById('favourites-list');
            favList.innerHTML = movies.length ? movies.map(movie => `
                <li><strong>${movie.movie_name}</strong><br><span>${movie.movie_description || ''}</span></li>
            `).join('') : '<li>No favourites yet.</li>';
        });

    fetch('http://localhost:3001/api/watchlist')
        .then(res => res.json())
        .then(movies => {
            const watchList = document.getElementById('watchlist-list');
            watchList.innerHTML = movies.length ? movies.map(movie => `
                <li><strong>${movie.movie_name}</strong><br><span>${movie.movie_description || ''}</span></li>
            `).join('') : '<li>No watchlist movies yet.</li>';
        });
});
