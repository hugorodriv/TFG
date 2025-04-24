<script>
    export let location;
    $: location;

    function getTimeAgo(timestamp) {
        const now = new Date();
        const pastDate = new Date(timestamp);
        const diffSec = Math.floor((now - pastDate) / 1000);

        if (diffSec < 60) {
            return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`;
        }
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) {
            return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
        }

        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) {
            return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
        }

        const diffDay = Math.floor(diffHr / 24);
        return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
    }
</script>

<h1 class="text-3xl">Cont scrolling post feed:</h1>
{#if location}
    <p>Location: {location.lat} {location.lon}</p>
    <p>Location: {location.resolved}</p>
    <p>Timestamp: {location.timestamp}</p>
    <p>Date: {new Date(location.timestamp)}</p>
    <p>Ago: {getTimeAgo(location.timestamp)}</p>
    <p class="mt-10">{JSON.stringify(location)}</p>
{:else}
    <p>Loc not provided</p>
{/if}
