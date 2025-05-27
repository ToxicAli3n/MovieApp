import { API_KEY } from './config.js';

const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-button');
const resultContainer = document.getElementById('result');
const dropdown = document.getElementById('dropdown');
const movieListContainer = document.getElementById('movie-list-container');
const showFavoritesButton = document.getElementById('show-favorites');

async function fetchMovie(query) {
    try {
        resultContainer.innerHTML = `<p class="msg">Please select a movie</p>`;
        movieListContainer.innerHTML = `<p class="msg">Loading movies...</p>`;
        
        await fetchMovies(query);
    } catch (err) {
        resultContainer.innerHTML = `<p class="msg">Error fetching data</p>`;
        movieListContainer.innerHTML = '';
        console.error(err);
    }
}

async function fetchMovieDetails(title) {
    try {
        resultContainer.innerHTML = `<p class="msg">Loading...</p>`;
        movieListContainer.innerHTML = '';
        
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`);
        const data = await res.json();
        
        if (data.Response === 'False') {
            resultContainer.innerHTML = `<p class="msg">Movie not found</p>`;
            return;
        }
        
        displayMovie(data);
    } catch (err) {
        resultContainer.innerHTML = `<p class="msg">Error fetching movie data</p>`;
        console.error(err);
    }
}

async function fetchMovies(query) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
        const data = await res.json();
        
        if (data.Response === 'False') {
            movieListContainer.innerHTML = `<p class="msg">No movies found</p>`;
            return;
        }
        
        const limitedResults = data.Search.slice(0, 8);
        
        displayMovies(limitedResults);
    } catch (err) {
        movieListContainer.innerHTML = `<p class="msg">Error fetching movies</p>`;
        console.error(err);
    }
}

function displayMovie(movie) {
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
}

function displayMovies(movies) {
    movieListContainer.innerHTML = movies.map(movie => `
        <div class="movie-item" data-title="${movie.Title}">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'no-image.jpg'}" alt="${movie.Title}">
            <span>${movie.Title} (${movie.Year})</span>
        </div>
    `).join('');
}

function addToFavorites(movie) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const exists = favorites.some(f => f.imdbID === movie.imdbID);
    if (!exists) {
        favorites.push({
            imdbID: movie.imdbID,
            Title: movie.Title,
            Year: movie.Year,
            Poster: movie.Poster
        });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${movie.Title} added to favorites!`);
    } else {
        alert(`${movie.Title} is already in favorites.`);
    }
}

function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
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

function removeFromFavorites(imdbID) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Movie removed from favorites!');
    showFavorites();
}

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
        console.error(err);
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
        searchInput.value = title;
        fetchMovieDetails(title);
    }
});

document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== searchInput) {
        dropdown.style.display = 'none';
    }
});

showFavoritesButton.addEventListener('click', showFavorites);