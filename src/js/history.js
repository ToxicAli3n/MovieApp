const movieListContainer = document.getElementById('movie-list-container');
const resultContainer = document.getElementById('result');

export function addToHistory(movie) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    
    history = history.filter(h => h.imdbID !== movie.imdbID);
    
    history.unshift({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster
    });
    
    localStorage.setItem('history', JSON.stringify(history));
}

export function showHistory() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    
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
            removeFromHistory(e.target.dataset.id);
        });
    });
}

export function removeFromHistory(imdbID) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history = history.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem('history', JSON.stringify(history));
    showHistory();
}