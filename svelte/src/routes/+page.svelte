<script>
    import { onMount, onDestroy } from "svelte";

    import { locationStore } from "$lib/stores/location";

    import Auth from "./Auth.svelte";
    import Welcome from "./Welcome.svelte";
    import Navbar from "./Navbar.svelte";
    import Bottombar from "./Bottombar.svelte";
    import PostFeed from "./PostFeed.svelte";

    let loadingLocation = false;

    export let data;
    const session = data.session;
    let accountData;
    let pfp;
    let checkLocInterval;

    // Location
    $: isLocationExpired = locationStore.isExpired();
    let locationError;

    let locationPermission = null;
    $: locationPermission;

    function checkExpiration() {
        isLocationExpired = locationStore.isExpired();
    }
    onMount(async () => {
        if (!session) {
            localStorage.clear();
            locationStore?.reset();
        } else {
            checkLocInterval = setInterval(checkExpiration, 1000);
            await checkPermissionStatus();
            accountData = JSON.parse(localStorage.getItem("accData") || "{}");
            pfp = localStorage.getItem("pfp");
            if (isLocationExpired) {
                console.log("Too old. Refreshing");
                if (locationPermission) {
                    await updateLocation();
                }
            }
        }
    });
    onDestroy(() => {
        if (checkLocInterval) clearInterval(checkLocInterval);
    });

    async function checkPermissionStatus() {
        try {
            const permission = await navigator.permissions.query({
                name: "geolocation",
            });

            locationPermission = permission.state === "granted";

            // Set up a listener for permission changes
            permission.onchange = () => {
                locationPermission = permission.state === "granted";
            };
        } catch (err) {
            console.error("Error checking permission:", err);
        } finally {
        }
    }

    async function updateLocation() {
        locationStore.reset();
        loadingLocation = true;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            console.log("error getting location");
        }
    }

    async function success(loc) {
        loadingLocation = false;
        locationStore.update(loc.coords.latitude, loc.coords.longitude);
        isLocationExpired = false;
        locationError = false;
    }

    function error(e) {
        loadingLocation = false;
        console.error(e);
        locationError = true;
    }
</script>

{#if !session}
    <Navbar showBack={false} />
    <Auth />
    <Welcome />
{:else}
    <Navbar showBack={false} />

    <div class="py-4 m-auto">
        {#if (isLocationExpired || !locationStore) && !locationError && !loadingLocation}
            <!-- Allow loc access -->
            <div
                class="bg-white w-11/12 m-auto border border-gray-300 rounded-lg shadow-sm"
            >
                <div class="mt-5 flex flex-col items-center pb-5">
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
                        on:click={updateLocation}
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
                </div>
            </div>
        {:else if locationError}
            <div
                class="bg-white w-11/12 m-auto border border-gray-300 rounded-lg shadow-sm"
            >
                <div class="mt-5 flex flex-col items-center pb-5">
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
                        Please allow permissions
                    </p>

                    <button
                        type="button"
                        class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors"
                        on:click={updateLocation}
                    >
                        Location error
                    </button>
                </div>
            </div>
        {:else}
            <PostFeed location={$locationStore} />
        {/if}
    </div>
    <Bottombar homeActive={true} />
{/if}

<!-- Icons -->
<!-- map: Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
<!-- rest: https://github.com/themesberg/flowbite-icons -->
