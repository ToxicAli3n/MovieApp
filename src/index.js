import { API_KEY } from './config.js';

const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-button');
const resultContainer = document.getElementById('result');
const dropdown = document.getElementById('dropdown');

async function fetchMovie(query) {
    try {
        resultContainer.innerHTML = `<p class="msg">Loading...</p>`;
        
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${query}`);
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

function displayMovie(movie) {
    const genres = movie.Genre.split(',').map(g => `<div>${g.trim()}</div>`).join('');
    
    resultContainer.innerHTML = `
    <div class="info">
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'no-image.jpg'}" class="poster" alt="${movie.Title}">
      <div>
        <h2>${movie.Title}</h2>
        <div class="rating">
          <img src="star-icon.png" alt="Star">
          <h4>${movie.imdbRating}</h4>
        </div>
        <div class="details">
          <span>${movie.Rated}</span>
          <span>${movie.Year}</span>
          <span>${movie.Runtime}</span>
        </div>
        <div class="genre">${genres}</div>
      </div>
    </div>
    <h3>Plot:</h3>
    <p>${movie.Plot}</p>
    <h3>Cast:</h3>
    <p>${movie.Actors}</p>
  `;
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
        fetchMovie(title);
    }
});

document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== searchInput) {
        dropdown.style.display = 'none';
    }
});
