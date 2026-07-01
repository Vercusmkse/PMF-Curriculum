export const STORAGE_KEY = 'pmf_bootcamp_progress_v2';

export function getSavedProgress() {
    let savedProgress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    if (Object.keys(savedProgress).length === 0) {
        for (let i = 1; i <= 16; i++) savedProgress[i] = false;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProgress));
    }
    return savedProgress;
}

export function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetProgressData() {
    const freshProgress = {};
    for (let i = 1; i <= 16; i++) freshProgress[i] = false;
    saveProgress(freshProgress);
    return freshProgress;
}