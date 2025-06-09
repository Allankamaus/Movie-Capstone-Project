const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'Movie database', 
    password: 'luxray3x', 
    port: 5432,
});

module.exports = pool;

// Test connection when this file is run directly
if (require.main === module) {
    pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Connection failed:', err);
        } else {
            console.log('Connection successful! Time:', res.rows[0].now);
        }
        pool.end();
    });
}