class EventManager {
    constructor() {
        this.events = {};
    }
    
    subscribe(eventType, callback) {
        if (typeof callback !== 'function') {
            throw new Error('no function');
        }
        
        if (!this.events[eventType]) {
            this.events[eventType] = [];
        }
        
        this.events[eventType].push(callback);
        
        return () => this.unsubscribe(eventType, callback);
    }
    
    unsubscribe(eventType, callback) {
        if (this.events[eventType]) {
            const index = this.events[eventType].indexOf(callback);
            if (index > -1) {
                this.events[eventType].splice(index, 1);
            }
        }
    }
    
    notify(eventType, data) {
        if (this.events[eventType]) {
            this.events[eventType].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${eventType} observer:`, error);
                }
            });
        }
    }
}

const eventManager = new EventManager();

const unsubscribe = eventManager.subscribe('test', (data) => {
    console.log('R:', data);
});

eventManager.notify('test', 'Hello!');
unsubscribe();
eventManager.notify('test', 'World!');
