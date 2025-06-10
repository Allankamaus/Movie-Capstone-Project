document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3001/api/favourites')
        .then(res => res.json())
        .then(movies => {
            if (!Array.isArray(movies)) {
                movies = [];
            }
            const favList = document.getElementById('favourites-list');
            favList.innerHTML = movies.length ? movies.map(movie => `
                <li data-movie-id="${movie.movie_id}">
                    <strong>${movie.movie_name}</strong><br>
                    <span>${movie.movie_description || ''}</span>
                    <div class="comments-section">
                        <ul class="comments-list" id="comments-list-${movie.movie_id}"></ul>
                        <form class="comment-form" data-movie-id="${movie.movie_id}" data-movie-name="${movie.movie_name}">
                            <input type="text" class="comment-input" placeholder="Add a comment..." required />
                            <button type="submit" class="comment-btn">Post</button>
                        </form>
                    </div>
                </li>
            `).join('') : '<li>No favourites yet.</li>';

            // Attach comment form listeners and load comments
            movies.forEach(movie => {
                loadComments(movie.movie_id);
                const form = document.querySelector(`form[data-movie-id='${movie.movie_id}']`);
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const input = form.querySelector('.comment-input');
                    const comment = input.value.trim();
                    if (!comment) return;
                    fetch('http://localhost:3001/api/comments', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            movie_id: movie.movie_id,
                            movie_name: movie.movie_name,
                            comment: comment
                        })
                    }).then(res => res.json()).then(() => {
                        input.value = '';
                        loadComments(movie.movie_id);
                    });
                });
            });
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

function loadComments(movie_id) {
    fetch(`http://localhost:3001/api/comments/${movie_id}`)
        .then(res => res.json())
        .then(comments => {
            const list = document.getElementById(`comments-list-${movie_id}`);
            if (list) {
                list.innerHTML = comments.length ? comments.map(c => `<li>${c.comment}</li>`).join('') : '';
            }
        });
}
