<script>
    import { onMount } from "svelte";

    /**
     * @type {{ lon: any; lat: any; timestamp: any; } | null}
     */
    export let location;

    let locationError = false;
    let noPermission = false;

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            location = null;
        }
    }

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

    async function success(loc) {
        // Store basic location data first
        location = {
            lon: loc.coords.longitude,
            lat: loc.coords.latitude,
            timestamp: loc.timestamp,
            resolved: null, // Will be populated once resolved
        };

        try {
            // Wait for the coordinates to resolve
            const resolvedLocation = await resolveCoordinates(
                loc.coords.latitude,
                loc.coords.longitude,
            );

            // Update the location object with the resolved value
            location.resolved = resolvedLocation;

            // Now save to localStorage with the resolved value
            localStorage.setItem("location", JSON.stringify(location));
        } catch (error) {
            console.error("Failed to resolve coordinates:", error);
            // Still save the basic location data even if resolution fails
            localStorage.setItem("location", JSON.stringify(location));
        }
    }

    function error(e) {
        console.error(e);
        locationError = true;
    }
    onMount(async () => {
        const permission = await navigator.permissions.query({
            name: "geolocation",
        });

        // only if user has already agreed to share location we automatically get it. if not, rest of comp will appear
        if (permission.state === "granted") {
            getLocation();
        } else {
            noPermission = true;
        }
    });
</script>

{#if !location && noPermission}
    <div class="border border-gray-200 rounded-lg shadow-sm">
        <div class="mt-10 flex flex-col items-center pb-10">
            <svg
                class="w-20 h-20 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    fill-rule="evenodd"
                    d="M11.906 1.994a8.002 8.002 0 0 1 8.09 8.421 7.996 7.996 0 0 1-1.297 3.957.996.996 0 0 1-.133.204l-.108.129c-.178.243-.37.477-.573.699l-5.112 6.224a1 1 0 0 1-1.545 0L5.982 15.26l-.002-.002a18.146 18.146 0 0 1-.309-.38l-.133-.163a.999.999 0 0 1-.13-.202 7.995 7.995 0 0 1 6.498-12.518ZM15 9.997a3 3 0 1 1-5.999 0 3 3 0 0 1 5.999 0Z"
                    clip-rule="evenodd"
                />
            </svg>
            <p class="my-5 text-xl font-medium text-gray-900">
                Location is needed to see posts
            </p>

            <button
                type="button"
                class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                on:click={() => {
                    getLocation();
                }}
            >
                <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
                Allow location access
            </button>

            {#if locationError}
                <div class="text-center mt-2 py-2 px-6">
                    <p>
                        Error getting location. Please allow neccesary
                        permissions and try again
                    </p>
                </div>
            {/if}
        </div>
    </div>
{/if}
<button on:click={getLocation}>GET LOC</button>
