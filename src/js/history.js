import { getItem, removeItem, setItem } from './storage.js';
import { eventManager, EVENT_TYPES } from './pattern.js';

export class HistoryManager {
    static init() {
        eventManager.on(EVENT_TYPES.MOVIE_SELECTED, (data) => {
            this.addToHistory(data.movie);
        });
        
        eventManager.on(EVENT_TYPES.HISTORY_UPDATED, (data) => {
            switch (data.action) {
                case 'remove':
                    this.removeFromHistory(data.imdbID);
                    break;
                case 'show':
                    break;
                case 'get':
                    eventManager.emit(EVENT_TYPES.HISTORY_UPDATED, {
                        action: 'show',
                        history: this.getHistory()
                    });
                    break;
            }
        });
    }
    
    static addToHistory(movie) {
        let history = getItem('history') || [];
        history = history.filter(h => h.imdbID !== movie.imdbID);
        history.unshift({
            imdbID: movie.imdbID,
            Title: movie.Title,
            Year: movie.Year,
            Poster: movie.Poster
        });
        setItem('history', history.slice(0, 10));
        
        eventManager.emit(EVENT_TYPES.HISTORY_UPDATED, {
            action: 'added',
            movie: movie,
            history: this.getHistory()
        });
    }
    
    static removeFromHistory(imdbID) {
        removeItem('history', imdbID);
        
        eventManager.emit(EVENT_TYPES.HISTORY_UPDATED, {
            action: 'show',
            history: this.getHistory()
        });
    }
    
    static getHistory() {
        return getItem('history');
    }
    
    static showHistory() {
        eventManager.emit(EVENT_TYPES.HISTORY_UPDATED, {
            action: 'show',
            history: this.getHistory()
        });
    }
}