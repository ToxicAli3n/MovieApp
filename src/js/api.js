import { API_KEY } from '../config/config.js';
import { eventManager, EVENT_TYPES } from './pattern.js';

const movieListContainer = document.getElementById('movie-list-container');

export async function fetchMovie(query) {
    try {
        eventManager.emit(EVENT_TYPES.SEARCH_PERFORMED, { query });
        await fetchMovies(query);
    } catch (err) {
        console.error('Error fetching movie:', err);
        movieListContainer.innerHTML = `<p class="msg">Error: ${err.message}</p>`;
    }
}

export async function fetchMovieDetails(title) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`);
        const data = await res.json();
        if (data.Response === 'False') {
            throw new Error('Movie not found');
        }
        
        eventManager.emit(EVENT_TYPES.MOVIE_DETAILS_LOADED, { movie: data });
        eventManager.emit(EVENT_TYPES.MOVIE_SELECTED, { movie: data });
    } catch (err) {
        console.error('Error fetching movie details:', err);
        movieListContainer.innerHTML = `<p class="msg">Error: ${err.message}</p>`;
    }
}

export async function fetchMovies(query) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
        const data = await res.json();
        if (data.Response === 'False') {
            throw new Error('No movies found');
        }
        const limitedResults = data.Search.slice(0, 8);
        
        eventManager.emit(EVENT_TYPES.SEARCH_RESULTS_UPDATED, {
            movies: limitedResults,
            query
        });
    } catch (err) {
        console.error('Error fetching movies:', err);
        movieListContainer.innerHTML = `<p class="msg">Error: ${err.message}</p>`;
    }
}