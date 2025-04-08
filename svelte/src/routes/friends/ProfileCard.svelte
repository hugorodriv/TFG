<script>
    import { onMount } from "svelte";
    export let username;
    export let name;
    export let img_url;
    export let acceptButton = false;

    export let sender_uuid;
    export let receiver_uuid;

    // if user is friend already the button text changes and the fetch changes slightly too,
    export let isFriend = false;
    console.log(sender_uuid, receiver_uuid);

    /**
     * @type {string}
     */
    let image_data;

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
    /**
     * @param {String} sender_uuid
     */
    async function acceptFriendship(sender_uuid) {
        const response = await fetch("../api/accept-friend-request", {
            method: "POST",
            body: JSON.stringify({ sender_uuid }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const body = await response.json();
        return body.success;
    }
    /**
     * @param {String} receiver_uuid
     */
    async function cancelFriendship(receiver_uuid) {
        const response = await fetch("../api/delete-friendship", {
            method: "POST",
            body: JSON.stringify({ receiver_uuid }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const body = await response.json();
        return body.success;
    }
</script>

<li class="py-3">
    <span
        class="p-3 flex items-center justify-between gap-4 rounded-lg border border-gray-100"
    >
        <a class="flex max-w-48 w-full" href="/p/{username}">
            <div class="">
                <img
                    class="drop-shadow-lg w-10 h-10 rounded-full"
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
        </a>
        {#if acceptButton}
            <!-- Accept friendship button -->
            <button
                type="button"
                class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                on:click={async (e) => {
                    const success = await acceptFriendship(sender_uuid);
                    if (success) {
                        e.target.innerText = "ACCEPTED";
                    }
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
                Accept
            </button>
        {:else}
            <!-- Cancel friendship button -->
            <button
                on:click={async (e) => {
                    const success = await cancelFriendship(receiver_uuid);
                    if (success) {
                        e.target.innerText = "REMOVED";
                    }
                }}
                class="px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors"
            >
                <span class="flex items-center gap-2">
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
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    {#if isFriend}
                        Remove
                    {:else}
                        Cancel
                    {/if}
                </span>
            </button>
        {/if}
    </span>
</li>
