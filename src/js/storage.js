export function getItem(key) {
    if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not supported');
        return [];
    }
    return JSON.parse(localStorage.getItem(key)) || [];
}

export function setItem(key, value) {
    if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not supported');
        return;
    }
    localStorage.setItem(key, JSON.stringify(value));
}

export function addItem(key, item, idField = 'imdbID') {
    const items = getItem(key);
    if (!items.some(i => i[idField] === item[idField])) {
        items.push(item);
        setItem(key, items);
    }
}

export function removeItem(key, id, idField = 'imdbID') {
    let items = getItem(key);
    items = items.filter(item => item[idField] !== id);
    setItem(key, items);
}