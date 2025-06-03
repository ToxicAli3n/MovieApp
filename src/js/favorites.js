import { getItem, addItem, removeItem } from './storage.js';
import { eventManager, EVENT_TYPES } from './pattern.js';

export class FavoritesManager {
    static init() {
        eventManager.on(EVENT_TYPES.FAVORITES_UPDATED, (data) => {
            switch (data.action) {
                case 'add':
                    this.addToFavorites(data.movie);
                    break;
                case 'remove':
                    this.removeFromFavorites(data.imdbID);
                    break;
                case 'show':
                    break;
                case 'get':
                    eventManager.emit(EVENT_TYPES.FAVORITES_UPDATED, {
                        action: 'show',
                        favorites: this.getFavorites()
                    });
                    break;
            }
        });
    }
    
    static addToFavorites(movie) {
        addItem('favorites', {
            imdbID: movie.imdbID,
            Title: movie.Title,
            Year: movie.Year,
            Poster: movie.Poster
        });
        
        alert(`${movie.Title} added to favorites!`);
        
        eventManager.emit(EVENT_TYPES.FAVORITES_UPDATED, {
            action: 'added',
            movie: movie,
            favorites: this.getFavorites()
        });
    }
    
    static removeFromFavorites(imdbID) {
        removeItem('favorites', imdbID);
        alert('Movie removed from favorites!');
        
        eventManager.emit(EVENT_TYPES.FAVORITES_UPDATED, {
            action: 'show',
            favorites: this.getFavorites()
        });
    }
    
    static getFavorites() {
        return getItem('favorites');
    }
    
    static showFavorites() {
        eventManager.emit(EVENT_TYPES.FAVORITES_UPDATED, {
            action: 'show',
            favorites: this.getFavorites()
        });
    }
}