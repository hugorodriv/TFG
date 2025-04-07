<script>
    import { onMount } from "svelte";
    export let username;
    export let name;
    export let img_url;
    export let uuid;

    /**
     * @type {string}
     */
    let image_data;
    let requestSent = false;

    onMount(() => {
        // if no img data, create blue bg and white letter (default pfp)
        const letter = name.slice(0, 1).toUpperCase();
        const svg = `
            <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <circle cx="64" cy="64" r="64" fill="#007BFF"/>
                <text x="64" y="64" font-size="64" fill="white" font-family="sans-serif"
                    text-anchor="middle" dominant-baseline="central">
                    ${letter}
                </text>
            </svg>`;

        image_data = `data:image/svg+xml;base64,${btoa(svg)}`;
        if (img_url) {
            (async () => {
                try {
                    const response = await fetch(img_url);
                    if (!response.ok) throw new Error("Failed to fetch image");

                    const blob = await response.blob();

                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = function () {
                        const base64data = String(reader.result);

                        image_data = base64data;
                    };
                } catch (error) {
                    console.error("Error fetching image:", error);
                }
            })().then(() => {});
        }
    });

    function sendFriendRequest(uuid) {
        requestSent = true;
    }

    console.log("test");
</script>

<li class="py-3 sm:py-4">
    <div class="flex items-center">
        <div class="shrink-0">
            <img
                class="w-8 h-8 rounded-full"
                alt="{username} profile"
                src={image_data}
            />
        </div>
        <div class="flex-1 min-w-0 ms-4">
            <p class="text-sm font-medium text-gray-900 truncate">
                @{username}
            </p>
            <p class="text-sm text-gray-500 truncate">
                {name}
            </p>
        </div>

        {#if requestSent}
            <p
                class="text-gray-800 text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
            >
                Request sent
            </p>
        {:else}
            <button
                type="button"
                class="text-white bg-gray-600 hover:bg-gray-800 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
                on:click={() => {
                    sendFriendRequest(uuid);
                }}
            >
                <svg
                    class="w-6 h-6 text-white"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill-rule="evenodd"
                        d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
                        clip-rule="evenodd"
                    />
                </svg>
                Add friend
            </button>
        {/if}
    </div>
</li>
