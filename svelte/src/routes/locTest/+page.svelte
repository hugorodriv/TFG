<script>
    import { locationStore } from "$lib/stores/location";
    import { onMount } from "svelte";
    import PostFeed from "./PostFeed.svelte";

    $: location = $locationStore;
    $: isLocationExpired = locationStore.isExpired();
    let locationError;
    let locationPermission = null;
    $: locationPermission;

    onMount(async () => {
        await checkPermissionStatus();
        // If no loc OR loc.timestamp is too old, refresh
        // console.log(localStorage.getItem(KEY));
        // getLocation();
        if (isLocationExpired) {
            console.log("Too old. Refreshing");
            updateLocation();
        }
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
        }
    }

    function updateLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            console.log("error idk");
        }
    }

    async function success(loc) {
        // Store basic location data first
        locationStore.update(loc.coords.latitude, loc.coords.longitude);
    }

    function error(e) {
        console.error(e);
        locationError = true;
    }
</script>

<div class="space-y-4 p-4 max-w-md m-auto">
    {#if !locationPermission}
        <p>Please allow location permissions</p>
        <button
            class="py-2 px-5 border cursor-pointer"
            on:click={updateLocation}>Grant Permissions</button
        >
    {:else if !locationError}
        <button
            class="py-2 px-5 border cursor-pointer"
            on:click={updateLocation}>Update loc</button
        >
        <button
            class="py-2 px-5 border cursor-pointer"
            on:click={locationStore.reset}>Delete store</button
        >
        <PostFeed location={$locationStore} />
    {:else}
        <p>Loc error</p>
    {/if}
</div>
