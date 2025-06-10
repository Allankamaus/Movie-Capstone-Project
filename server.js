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
            'INSERT INTO favourite_movies (movie_id, movie_name, movie_description) VALUES ($1, $2, $3) ON CONFLICT (movie_id) DO NOTHING',
            [movie_id, title, description]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add to watchlist
app.post('/api/watchlist', async (req, res) => {
    const { movie_id, title, description } = req.body;
    try {
        await pool.query(
            'INSERT INTO watchlist_moveis (movie_id, movie_name, movie_description) VALUES ($1, $2, $3) ON CONFLICT (movie_id) DO NOTHING',
            [movie_id, title, description]
        );
        res.json({ success: true });
        console.log('Added to watchlist:', {movie_id, title, description})
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3001, () => console.log('Server running on port 3001'));


//Fetch favourites and watchlist
app.get('/api/favourites', async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM favorite_movies');
        res.json(result.rows);
    }
    catch(err){
        console.error('Error fetching favourites:', err);
        res.status(500).json({ error: 'Failed to fetch favourites'})
    }
});