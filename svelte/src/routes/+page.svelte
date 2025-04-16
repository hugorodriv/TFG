<script>
    import { onMount } from "svelte";

    import Auth from "./auth.svelte";
    import Navbar from "./Navbar.svelte";
    import Bottombar from "./Bottombar.svelte";
    import LocationPrompt from "./LocationPrompt.svelte";
    import LocationShowcase from "./LocationShowcase.svelte";

    export let data;
    const session = data.session;

    /**
     * @type {{ lon: any; lat: any; timestamp: any; } | null}
     */
    let location;

    let accountData;
    let pfp;

    let loading = true;
    let loadingMorePosts = false;
    let allPostsLoaded = false;

    const LOC_REFRESH_MINUTES = 10;
    onMount(() => {
        if (!session) {
            localStorage.clear();
        } else {
            accountData = JSON.parse(localStorage.getItem("accData") || "{}");
            pfp = localStorage.getItem("pfp");
            location = JSON.parse(localStorage.getItem("location") || "null");
            if (
                location?.timestamp + LOC_REFRESH_MINUTES * 60 * 1000 <=
                Date.now()
            ) {
                console.log("Location too old. Refreshing");
                location = null;
                localStorage.setItem("location", "null");
            }

            // load initial posts
            if (location) {
                loadMorePosts();
            }
            // Set up scroll event listener
            window.addEventListener("scroll", handleScroll);
            loading = false;
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
    });

    let timeoutId;
    let localPostsCache = [];
    let currentNumberOfPosts = 0;

    async function loadMorePosts() {
        if (loadingMorePosts || allPostsLoaded) return;
        loadingMorePosts = true;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

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
                currentNumberOfPosts += 2;
                localPostsCache = [...localPostsCache, ...body.posts];
            } else {
                allPostsLoaded = true;
            }
        } finally {
            loadingMorePosts = false;
        }
    }

    function getTimeAgo(timestamp) {
        const now = new Date();
        const pastDate = new Date(timestamp);
        const diffSec = (now - pastDate) / 1000;

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
            <div class="space-y-4 p-4 max-w-md m-auto">
                {#if !location}
                    <LocationPrompt bind:location />
                {:else}
                    <LocationShowcase {location} />
                {/if}
            </div>

            <div
                class="no-scrollbar grid grid-cols-1 gap-2"
                on:scroll={handleScroll}
            >
                {#each localPostsCache as post}
                    <a href="/post/{post.post_uuid}">
                        <div class=" overflow-hidden">
                            <img
                                loading="lazy"
                                src={post.img_url}
                                alt="Post"
                                class="text-center m-auto rounded w-11/12 h-full object-cover"
                            />
                        </div>
                    </a>
                {/each}
            </div>
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
                <div class="text-center text-gray-500 py-4">
                    No more posts to load
                </div>
            {:else if localPostsCache.length === 0 && location}
                <div class="text-center text-gray-500 py-4">
                    No posts found in your area
                </div>
            {/if}

            <Bottombar homeActive={true} />
        {/if}
    </div>
{/if}
<!-- Icons -->
<!-- map: Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
<!-- rest: https://github.com/themesberg/flowbite-icons -->

<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }

    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
