<script>
    import { onMount } from "svelte";

    import { locationStore } from "$lib/stores/location";

    import Auth from "./auth.svelte";
    import Navbar from "./Navbar.svelte";
    import Bottombar from "./Bottombar.svelte";
    import PostFeed from "./PostFeed.svelte";

    let loading = true;

    export let data;
    const session = data.session;
    let accountData;
    let pfp;

    $: isLocationExpired = locationStore.isExpired();
    let locationError;
    let locationPermission = null;
    $: locationPermission;

    onMount(async () => {
        if (!session) {
            localStorage.clear();
        } else {
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
        loading = false;
    });

    // Location
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
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            console.log("error getting location");
        }
    }

    async function success(loc) {
        // Store basic location data first
        locationStore.update(loc.coords.latitude, loc.coords.longitude);
        locationError = false;
    }

    function error(e) {
        console.error(e);
        locationError = true;
    }
</script>

{#if loading}
    <div class="mt-28 text-center">
        <svg
            class="inline w-8 h-8 text-gray-200 animate-spin fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
        >
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
            />
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
            />
        </svg>
    </div>
{:else}
    <div>
        {#if !session}
            <Auth />
        {:else}
            <Navbar />

            <div class="py-4 m-auto">
                {#if !locationPermission && !locationError}
                    <!-- Please allow loc access -->
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
    </div>
{/if}

<!-- Icons -->
<!-- map: Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
<!-- rest: https://github.com/themesberg/flowbite-icons -->
