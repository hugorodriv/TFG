<script>
    import { onMount, onDestroy } from "svelte";
    export let location;
    $: location;
    $: if (location) {
        loadMorePosts();
    }

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

    let accountData;
    let pfp;

    let loading = true;
    let loadingMorePosts = false;
    let allPostsLoaded = false;

    let localPostsCache = [];
    $: localPostsCache;
    let currentNumberOfPosts = 0;

    // Infinite scroll logic
    onMount(async () => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");
        pfp = localStorage.getItem("pfp");
        // load initial posts
        if (location) {
            await loadMorePosts();
        }
        // Set up scroll event listener
        window.addEventListener("scroll", handleScroll);
        loading = false;
    });
    onDestroy(() => {
        try {
            window.removeEventListener("scroll", handleScroll);
        } catch {}
    });

    async function loadMorePosts() {
        if (loadingMorePosts || allPostsLoaded || !location.lat) return;
        loadingMorePosts = true;

        try {
            const response = await fetch("./api/get-close-posts", {
                method: "POST",
                body: JSON.stringify({
                    userPosition: {
                        lat: location?.lat,
                        lng: location?.lon,
                    },
                    starting: currentNumberOfPosts,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const body = await response.json();
            if (!body || !body.posts) {
                allPostsLoaded = true;
                return;
            }
            if (body.success && body.posts.length > 0) {
                currentNumberOfPosts += body.posts.length;
                localPostsCache = [...localPostsCache, ...body.posts];
            } else {
                allPostsLoaded = true;
            }
        } finally {
            loadingMorePosts = false;
        }
    }

    function handleScroll() {
        const scrollThreshold = 200; // pixels from bottom to trigger load
        const bottomPosition =
            document.documentElement.scrollHeight -
            window.innerHeight -
            window.scrollY;

        if (
            bottomPosition < scrollThreshold &&
            !loadingMorePosts &&
            !allPostsLoaded &&
            location
        ) {
            loadMorePosts();
        }
    }
    function getPostLink(post_uuid) {
        const user_uuid = accountData?.uuid;
        const timestamp = Date.now();

        // Combine the data
        const data = {
            l: [location?.lat, location?.lon],
            u: user_uuid,
            t: timestamp,
            p: post_uuid,
        };

        // Convert to base64 encoding
        const encoded = btoa(JSON.stringify(data));

        // Generate the link
        return `/post/${encodeURIComponent(encoded)}`;
    }

    function getPosterPfp(pfp_url, poster_name) {
        if (pfp_url) return pfp_url;

        const letter = poster_name.slice(0, 1).toUpperCase();
        const svg = `
            <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <circle cx="64" cy="64" r="64" fill="#007BFF"/>
                <text x="64" y="64" font-size="64" fill="white" font-family="sans-serif"
                    text-anchor="middle" dominant-baseline="central">
                    ${letter}
                </text>
            </svg>`;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }
</script>

<!---->
<!-- {#if location.lat} -->
<!--     <p>Location: {location.lat} {location.lon}</p> -->
<!--     <p>Location: {location.resolved}</p> -->
<!--     <p>Timestamp: {location.timestamp}</p> -->
<!--     <p>Date: {new Date(location.timestamp)}</p> -->
<!--     <p>Ago: {getTimeAgo(location.timestamp)}</p> -->
<!--     <p class="mt-10">{JSON.stringify(location)}</p> -->
<!-- {:else} -->
<!--     <p>Error getting location</p> -->
<!-- {/if} -->
<!---->

{#if location.lat}
    <div class="text-center space-y-1">
        <p class="text-lg font-semibold text-gray-800">
            Showing posts near you
        </p>
        <p class="text-sm text-gray-500">{location.resolved}</p>
    </div>
    <ul class="mt-4 grid grid-cols-1 gap-8" on:scroll={handleScroll}>
        {#each localPostsCache as post}
            <li>
                <a
                    href={"../p/" + post.username}
                    class="w-11/12 py-1 m-auto flex items-center gap-3"
                >
                    <img
                        src={getPosterPfp(post.pfp_url, post.poster_name)}
                        alt="profile"
                        class="shadow-lg w-10 h-10 rounded-full"
                    />
                    <div>
                        <p class="font-semibold">{post.poster_name}</p>
                        <p class="text-sm text-gray-500">
                            {post.resolved_location}
                        </p>
                    </div>
                    <div class="ml-auto text-sm text-gray-400">
                        {getTimeAgo(post.created_at)}
                    </div>
                </a>
                <a href={getPostLink(post.post_uuid)}>
                    <div class="overflow-hidden">
                        <img
                            loading="lazy"
                            src={post.img_url}
                            alt="Post"
                            class="text-center m-auto rounded w-11/12 h-full object-cover"
                        />
                    </div>
                </a>
            </li>
        {/each}
    </ul>
    {#if loadingMorePosts}
        <div class="no-scrollbar flex justify-center items-center py-4">
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
    {:else if allPostsLoaded && localPostsCache.length > 0}
        <div class="text-center text-gray-500 py-4">No more posts</div>
    {:else if localPostsCache.length === 0 && location}
        <div class="text-center text-gray-500 py-4">
            No posts found in your area
        </div>
    {/if}
{:else}
    <div class="text-center">
        <svg
            class="inline w-4 h-4 text-gray-200 animate-spin fill-blue-600"
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
{/if}
