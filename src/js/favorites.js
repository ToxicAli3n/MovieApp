import { getItem, addItem, removeItem } from './storage.js';
const movieListContainer = document.getElementById('movie-list-container');
const resultContainer = document.getElementById('result');

export function addToFavorites(movie) {
    addItem('favorites', {
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster
    });
    alert(`${movie.Title} added to favorites!`);
}

export function showFavorites(favorites) {
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
            removeFromFavorites(e.target.dataset.id);
        });
    });
}

export function removeFromFavorites(imdbID) {
    removeItem('favorites', imdbID);
    alert('Movie removed from favorites!');
    showFavorites(getFavorites());
}

export function getFavorites() {
    return getItem('favorites');
}