<script>
    export let post;
    /**
     * @type {{ uuid: any; }}
     */
    export let accountData;
    /**
     * @type {{ lat: any; lon: any; }}
     */
    export let location;
    let loaded = false;

    /**
     * @param {any} post_uuid
     */
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

    /**
     * @param {any} pfp_url
     * @param {string} poster_name
     */
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
    /**
     * @param {string | number | Date} timestamp
     */
    function getTimeAgo(timestamp) {
        const now = new Date();
        const pastDate = new Date(timestamp);
        // @ts-ignore
        const diffSec = Math.floor((now - pastDate) / 1000);

        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) {
            return `${diffMin}min ago`;
        }

        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) {
            return `${diffHr}h ago`;
        }

        const diffDay = Math.floor(diffHr / 24);
        return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
    }
</script>

<li
    class="rounded-lg border border-gray-300 shadow-lg w-11/12 justify-center m-auto"
>
    {#if loaded}
        <a
            href={"../p/" + post.username}
            class="bg-white rounded-t-lg px-2 py-2 m-auto flex items-center gap-3"
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
    {:else}
        <div class="py-1 m-auto items-center gap-3 animate-pulse">
            <div class="flex items-center gap-3">
                <div class="bg-gray-300 rounded-full w-10 h-10"></div>
                <div class=" flex-1">
                    <div class="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
            <div class="mt-3 bg-gray-300 rounded h-128"></div>
        </div>
    {/if}

    <a href={getPostLink(post.post_uuid)}>
        <img
            style:height={loaded ? "auto" : 0}
            src={post.img_url}
            alt="Post"
            class="text-center m-auto rounded-b-lg object-cover"
            loading="lazy"
            on:load={() => {
                loaded = true;
            }}
        />
    </a>
</li>
