const movieListContainer = document.getElementById('movie-list-container');
const resultContainer = document.getElementById('result');

export function addToFavorites(movie) {
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

export function showFavorites() {
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

export function removeFromFavorites(imdbID) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Movie removed from favorites!');
    showFavorites();
}