import { eventManager, EVENT_TYPES } from './pattern.js';

const resultContainer = document.getElementById('result');
const movieListContainer = document.getElementById('movie-list-container');

export class MovieRenderer {
    static init() {
        eventManager.on(EVENT_TYPES.MOVIE_DETAILS_LOADED, (data) => {
            this.displayMovie(data.movie);
        });
        
        eventManager.on(EVENT_TYPES.SEARCH_RESULTS_UPDATED, (data) => {
            this.displayMovies(data.movies);
        });
        
        eventManager.on(EVENT_TYPES.FAVORITES_UPDATED, (data) => {
            if (data.action === 'show') {
                this.showFavorites(data.favorites);
            }
        });
        
        eventManager.on(EVENT_TYPES.HISTORY_UPDATED, (data) => {
            if (data.action === 'show') {
                this.showHistory(data.history);
            }
        });
    }
    
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
            eventManager.emit(EVENT_TYPES.FAVORITES_UPDATED, {
                action: 'add',
                movie: movie
            });
        });
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
    
    static showFavorites(favorites) {
        if (favorites.length === 0) {
            movieListContainer.innerHTML = `<p class="msg">No favorite movies yet.</p>`;
            resultContainer.innerHTML = `<p class="msg">Please select a movie</p>`;
            return;
        }
        
        movieListContainer.innerHTML = favorites.map(movie => `
            <div class="movie-item" data-title="${movie.Title}">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'no-image.jpg'}" alt="${movie.Title}">
                <span>${movie.Title} (${movie.Year})</span>
                <button class="remove-favorite" data-id="${movie.imdbID}" title="Remove from favorites">✖</button>
            </div>
        `).join('');
        resultContainer.innerHTML = `<p class="msg">Click a movie to view details.</p>`;
        
        document.querySelectorAll('.remove-favorite').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                eventManager.emit(EVENT_TYPES.FAVORITES_UPDATED, {
                    action: 'remove',
                    imdbID: e.target.dataset.id
                });
            });
        });
    }
    
    static showHistory(history) {
        if (history.length === 0) {
            movieListContainer.innerHTML = `<p class="msg">No movies in your viewing history yet.</p>`;
            resultContainer.innerHTML = `<p class="msg">Your viewing history is empty.</p>`;
            return;
        }
        
        movieListContainer.innerHTML = history.map(movie => `
            <div class="movie-item" data-title="${movie.Title}">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'no-image.jpg'}" alt="${movie.Title}">
                <span>${movie.Title} (${movie.Year})</span>
                <button class="remove-from-history" data-id="${movie.imdbID}" title="Remove from history">✖</button>
            </div>
        `).join('');
        resultContainer.innerHTML = `<p class="msg">Click a movie from history to view details.</p>`;
        
        document.querySelectorAll('.remove-from-history').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                eventManager.emit(EVENT_TYPES.HISTORY_UPDATED, {
                    action: 'remove',
                    imdbID: e.target.dataset.id
                });
            });
        });
    }
}