import { API_KEY } from '../config/config.js';
import { fetchMovie, fetchMovieDetails } from './api.js';
import { FavoritesManager } from './favorites.js';
import { HistoryManager } from './history.js';
import { eventManager, EVENT_TYPES } from './pattern.js';

const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-button');
const dropdown = document.getElementById('dropdown');
const movieListContainer = document.getElementById('movie-list-container');
const showFavoritesButton = document.getElementById('show-favorites');
const showHistoryButton = document.getElementById('show-history');

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchMovie(query);
        dropdown.style.display = 'none';
    }
});

searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            fetchMovie(query);
            dropdown.style.display = 'none';
        }
    }
});

searchInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    
    if (query.length < 3) {
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
        return;
    }
    
    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
        const data = await res.json();
        
        if (data.Response === 'False') {
            dropdown.style.display = 'none';
            dropdown.innerHTML = '';
            return;
        }
        
        const limitedResults = data.Search.slice(0, 4);
        
        dropdown.innerHTML = limitedResults.map(movie =>
            `<div class="dropdown-item" data-title="${movie.Title}">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'no-image.jpg'}" alt="${movie.Title}">
                <span>${movie.Title} (${movie.Year})</span>
            </div>`
        ).join('');
        
        dropdown.style.display = 'block';
    } catch (err) {
        console.error('Error:', err);
        dropdown.style.display = 'none';
    }
});

dropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.dropdown-item');
    if (item) {
        const title = item.dataset.title;
        searchInput.value = title;
        dropdown.style.display = 'none';
        fetchMovieDetails(title);
    }
});

movieListContainer.addEventListener('click', (e) => {
    const item = e.target.closest('.movie-item');
    if (item) {
        const title = item.dataset.title;
        fetchMovieDetails(title);
    }
});

document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== searchInput) {
        dropdown.style.display = 'none';
    }
});

showFavoritesButton.addEventListener('click', () => {
    FavoritesManager.showFavorites();
});

showHistoryButton.addEventListener('click', () => {
    HistoryManager.showHistory();
});

function initializeApp() {
    FavoritesManager.init();
    HistoryManager.init();
    
    eventManager.on(EVENT_TYPES.SEARCH_PERFORMED, (data) => {
    });
    
    eventManager.on(EVENT_TYPES.MOVIE_SELECTED, (data) => {
    });
}

initializeApp();
