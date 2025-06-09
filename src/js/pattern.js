export const EVENT_TYPES = {
    FAVORITES_UPDATED: 'favorites_updated',
    HISTORY_UPDATED: 'history_updated',
    MOVIE_SELECTED: 'movie_selected',
    SEARCH_RESULTS_UPDATED: 'search_results_updated',
    MOVIE_DETAILS_LOADED: 'movie_details_loaded',
    SEARCH_PERFORMED: 'search_performed'
};

export class EventManager {
    constructor() {
        this.events = new Map();
    }
    
    on(eventType, callback) {
        if (typeof callback !== 'function') {
            throw new Error('no function');
        }
        
        if (!this.events.has(eventType)) {
            this.events.set(eventType, new Set());
        }
        
        this.events.get(eventType).add(callback);
        
        return () => this.off(eventType, callback);
    }
    
    off(eventType, callback) {
        if (this.events.has(eventType)) {
            this.events.get(eventType).delete(callback);
            
            if (this.events.get(eventType).size === 0) {
                this.events.delete(eventType);
            }
        }
    }
    
    emit(eventType, data) {
        if (this.events.has(eventType)) {
            this.events.get(eventType).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${eventType} observer:`, error);
                }
            });
        }
    }
    
    once(eventType, callback) {
        if (typeof callback !== 'function') {
            throw new Error('no function');
        }
        
        const onceWrapper = (data) => {
            callback(data);
            this.off(eventType, onceWrapper);
        };
        
        return this.on(eventType, onceWrapper);
    }
    
    clear(eventType) {
        if (eventType) {
            this.events.delete(eventType);
        } else {
            this.events.clear();
        }
    }
}

export const eventManager = new EventManager();