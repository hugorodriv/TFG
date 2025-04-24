import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';

const STORAGE_KEY = 'locationStore';
const UPDATE_INTERVAL = 5 * 60 * 1000

const defaultLocationData = {
    lat: null,
    lon: null,
    timestamp: null,
    resolved: null
};

async function resolveCoordinates(lat, lon) {
    // Return a promise for the fetch operation
    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        {
            headers: {
                "User-Agent": "TFG_HRR",
            },
        },
    );
    const res = await response.json();
    return `${res.address.village || res.address.town || res.address.hamlet || res.address.suburb || res.address.city_district || res.address.neighbourhood || "Unknown"}, ${res.address.province || res.address.city || res.address.county || res.address.state || "Unknown"}`;
}

const createLocationStore = () => {
    const initialData = browser && localStorage.getItem(STORAGE_KEY)
        ? JSON.parse(localStorage.getItem(STORAGE_KEY))
        : defaultLocationData;

    const locationStore = writable(initialData);

    if (browser) {
        locationStore.subscribe(value => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        });
    }

    return {
        subscribe: locationStore.subscribe,

        update: async (lat, lon) => {
            locationStore.update(() => ({
                lat,
                lon,
                timestamp: Date.now(),
                resolved: null
            }));

            try {
                const resolvedLocation = await resolveCoordinates(lat, lon);

                locationStore.update(currentValue => ({
                    ...currentValue,
                    resolved: resolvedLocation
                }));
            } catch (error) {
                console.error("Failed to resolve coordinates:", error);

                locationStore.update(currentValue => ({
                    ...currentValue,
                    resolved: "Couldnt determine city"
                }));
            }
        },

        isExpired: () => {
            const data = get(locationStore);
            if (!data.timestamp) return true;

            const age = Date.now() - data.timestamp;
            return age > UPDATE_INTERVAL;
        },

        reset: () => {
            locationStore.set(defaultLocationData);
        },

        getData: () => get(locationStore)
    };
};

export const locationStore = createLocationStore();
