const express = require('express');
const pool = require('./conn');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Add to favourites
app.post('/api/favourites', async (req, res) => {
    const { movie_id, title, description } = req.body;
    try {
        await pool.query(
            'INSERT INTO favorite_movies (movie_id, movie_name, movie_description) VALUES ($1, $2, $3) ON CONFLICT (movie_id) DO NOTHING',
            [movie_id, title, description]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error('error adding to fasves', err);
    }
});

// Add to watchlist
app.post('/api/watchlist', async (req, res) => {
    const { movie_id, title, description } = req.body;
    try {
        await pool.query(
            'INSERT INTO watchlist_movies (movie_id, movie_name, movie_description) VALUES ($1, $2, $3) ON CONFLICT (movie_id) DO NOTHING',
            [movie_id, title, description]
        );
        res.json({ success: true });
        console.log('Added to watchlist:', {movie_id, title, description})
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all favourite movies
app.get('/api/favourites', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM favorite_movies');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all watchlist movies
app.get('/api/watchlist', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM watchlist_movies');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all comments for a movie
app.get('/api/comments/:movie_id', async (req, res) => {
    const { movie_id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM comments WHERE movie_id = $1 ORDER BY comment_id ASC', [movie_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a comment to a movie
app.post('/api/comments', async (req, res) => {
    const { movie_id, movie_name, comment } = req.body;
    try {
        await pool.query(
            'INSERT INTO comments (movie_id, movie_name, comment) VALUES ($1, $2, $3)',
            [movie_id, movie_name, comment]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3001, () => console.log('Server running on port 3001'));