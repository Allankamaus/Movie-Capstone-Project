# CREATE Database IF NOT EXISTS movie_databse;

# CREATE TABLE watchlist_movies (
#     Movie_ID INT PRIMARY KEY,
#     Movie_Name VARCHAR(255),
#     Movie_Description TEXT
# );

# CREATE TABLE favorite_movies (
#     Movie_ID INT PRIMARY KEY,
#     Movie_Name VARCHAR(255),
#     Movie_Description TEXT
# );
# 
# comment table
# CREATE TABLE comments (
#     comment_id SERIAL PRIMARY KEY,
#     movie_id INT,
#     movie_name VARCHAR(255),
#     comment TEXT,
#     FOREIGN KEY (movie_id) REFERENCES favorite_movies(movie_id)
# );