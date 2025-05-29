import { addToFavorites } from './favorites.js';
import { addToHistory } from './history.js';

const resultContainer = document.getElementById('result');
const movieListContainer = document.getElementById('movie-list-container');

export class MovieRenderer {
    static displayMovie(movie) {
        movieListContainer.innerHTML = '';
        
        const genres = movie.Genre.split(',').map(g => `<div>${g.trim()}</div>`).join('');
        resultContainer.innerHTML = `
        <div class="info">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'no-image.jpg'}" class="poster" alt="${movie.Title}">
            <div>
                <h2>${movie.Title}</h2>
                <div class="rating">
                    <img src="star-icon.png" alt="Star" width="20">
                    <h4>${movie.imdbRating}</h4>
                </div>
                <div class="details">
                    <span>${movie.Rated}</span>
                    <span>${movie.Year}</span>
                    <span>${movie.Runtime}</span>
                </div>
                <div class="genre">${genres}</div>
                <button id="add-favorite" data-title="${movie.Title}">❤️ Add to Favorites</button>
            </div>
        </div>
        <h3>Plot:</h3>
        <p>${movie.Plot}</p>
        <h3>Cast:</h3>
        <p>${movie.Actors}</p>
        `;
        document.getElementById('add-favorite').addEventListener('click', () => {
            addToFavorites(movie);
        });
        
        addToHistory(movie);
    }
    
    static displayMovies(movies) {
        resultContainer.innerHTML = `<p class="msg">Search results. Click a movie to view details.</p>`;
        movieListContainer.innerHTML = movies.map(movie => `
            <div class="movie-item" data-title="${movie.Title}">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'no-image.jpg'}" alt="${movie.Title}">
                <span>${movie.Title} (${movie.Year})</span>
            </div>
        `).join('');
    }
}