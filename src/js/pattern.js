class EventManager {
    constructor() {
        this.events = new Map();
    }
    
    on(eventType, callback) {
        if (typeof callback !== 'function') {
            throw new Error('no function');
        }
        
        if (!this.events.has(eventType)) {
            this.events.set(eventType, []);
        }
        
        this.events.get(eventType).push(callback);
        
        return () => this.off(eventType, callback);
    }
    
    off(eventType, callback) {
        if (this.events.has(eventType)) {
            const callbacks = this.events.get(eventType);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
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
    
    clear(eventType) {
        if (eventType) {
            this.events.delete(eventType);
        } else {
            this.events.clear();
        }
    }
}

const eventManager = new EventManager();

eventManager.on('click', (data) => console.log('Click:', data));
eventManager.on('hover', (data) => console.log('Hover:', data));

eventManager.emit('click', 'clicked');
eventManager.emit('hover', 'el');

eventManager.clear();
eventManager.emit('hover', 'clear');