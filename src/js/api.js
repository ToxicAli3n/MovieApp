import { API_KEY } from '../config/config.js';
import { displayMovie, displayMovies } from './ui.js';

const movieListContainer = document.getElementById('movie-list-container');

export async function fetchMovie(query) {
    try {
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
        displayMovie(data);
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
        displayMovies(limitedResults);
    } catch (err) {
        console.error('Error fetching movies:', err);
        movieListContainer.innerHTML = `<p class="msg">Error: ${err.message}</p>`;
    }
}