<script>
    import Bottombar from "../../Bottombar.svelte";
    import Navbar from "../../Navbar.svelte";
    import { onMount } from "svelte";

    export let data;
    let accountData;
    let loading = true;
    let confirmFriensdhipDeletion = false;

    let userNotFound = true;
    let isOwnProfile = false;
    const profile = data.userdata;
    const friendshipStatus = data.friendshipStatus;
    const posts = data.friendPosts;
    /**
     * @type {string}
     */
    let image_data;
    let requestSent = false;

    /**
     * @param {String} uuid
     */
    async function sendFriendRequest(uuid) {
        const response = await fetch("../api/send-friend-request", {
            method: "POST",
            body: JSON.stringify({ uuid }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const body = await response.json();
        if (body.success) {
            requestSent = true;
        }
    }

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

    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");

        if (data.success && profile) {
            userNotFound = false;

            if (profile.username == accountData?.username) {
                isOwnProfile = true;
                image_data = localStorage.getItem("pfp") || "";
            } else {
                // if no img data, create blue bg and white letter (default pfp)
                const letter = profile.name.slice(0, 1).toUpperCase();
                const svg = `
                <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="64" cy="64" r="64" fill="#007BFF"/>
                    <text x="64" y="64" font-size="64" fill="white" font-family="sans-serif"
                        text-anchor="middle" dominant-baseline="central">
                        ${letter}
                    </text>
                </svg>`;

                image_data = `data:image/svg+xml;base64,${btoa(svg)}`;
                if (profile.img_url) {
                    (async () => {
                        try {
                            const response = await fetch(profile.img_url);
                            if (!response.ok)
                                throw new Error("Failed to fetch image");

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
            }
        } else {
            const letter = "?";
            const svg = `
            <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <circle cx="64" cy="64" r="64" fill="#cad5e2"/>
                <text x="64" y="64" font-size="64" fill="black" font-family="sans-serif"
                    text-anchor="middle" dominant-baseline="central">
                    ${letter}
                </text>
            </svg>`;

            image_data = `data:image/svg+xml;base64,${btoa(svg)}`;
        }
        loading = false;
    });
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
    <Navbar />
    <div class="space-y-4 p-4 max-w-md m-auto">
        {#if userNotFound}
            <div class="border border-gray-200 rounded-lg shadow-sm">
                <div class="mt-10 flex flex-col items-center pb-10">
                    <img
                        class="drop-shadow-lg w-24 h-24 mb-3 rounded-full shadow-lg"
                        src={image_data}
                        alt="pfp"
                    />
                    <p class="my-5 text-xl font-medium text-gray-900">
                        User not found
                    </p>
                </div>
            </div>
        {:else}
            <div class="border border-gray-200 rounded-lg shadow-sm">
                <div class="mt-10 flex flex-col items-center pb-10">
                    <img
                        class="drop-shadow-lg w-24 h-24 mb-3 rounded-full shadow-lg"
                        src={image_data}
                        alt="pfp"
                    />
                    <p class="mb-1 text-xl font-medium text-gray-900">
                        {profile.name}
                    </p>
                    <p class="text-sm text-gray-500">
                        @{profile.username}
                    </p>
                    <p class="mt-2 px-5 text-sm text-gray-600">
                        {profile.bio}
                    </p>

                    {#if !isOwnProfile}
                        <!-- If friendship status null  -->
                        {#if !friendshipStatus}
                            {#if !requestSent}
                                <button
                                    type="button"
                                    class="mt-4 text-white bg-blue-600 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
                                    on:click={async () => {
                                        await sendFriendRequest(profile.uuid);
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
                            {:else}
                                <p
                                    class="text-gray-800 text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
                                >
                                    Request sent
                                </p>
                            {/if}
                        {:else if friendshipStatus === "PENDING"}
                            <p
                                class="text-gray-800 text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
                            >
                                Friend request pending
                            </p>
                        {:else if friendshipStatus === "PENDING_YOU"}
                            <p
                                class="text-gray-800 text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
                            >
                                Accept friend request
                            </p>
                            <button
                                type="button"
                                class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                on:click={async (e) => {
                                    const success = await acceptFriendship(
                                        profile.uuid,
                                    );
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
                        {:else if friendshipStatus === "ACCEPTED"}
                            <p
                                class="text-gray-800 text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
                            >
                                Already friends :)
                            </p>

                            <!-- Cancel friendship button -->
                            {#if confirmFriensdhipDeletion}
                                <button
                                    on:click={async (e) => {
                                        const success = await cancelFriendship(
                                            profile.uuid,
                                        );
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
                                        Confirm
                                    </span>
                                </button>
                            {:else}
                                <button
                                    on:click={async (e) => {
                                        confirmFriensdhipDeletion = true;
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
                                        Remove
                                    </span>
                                </button>
                            {/if}
                        {/if}
                    {:else}
                        <div class="flex mt-4">
                            <a
                                href="/settings"
                                class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-800"
                                >Edit profile</a
                            >
                        </div>
                    {/if}
                </div>
            </div>
            <div class="grid grid-cols-3 gap-1">
                {#each posts as post}
                    <a href="/post/{post.post_uuid}">
                        <div class="rounded-lg overflow-hidden shadow-lg">
                            <img
                                loading="lazy"
                                src={post.img_url}
                                alt="Post"
                                class="w-full h-48 object-cover"
                            />
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    </div>
    <Bottombar />
{/if}
