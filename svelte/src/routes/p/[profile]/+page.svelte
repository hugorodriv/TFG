<script>
    import Bottombar from "../../Bottombar.svelte";
    import Navbar from "../../Navbar.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    export let data;
    let accountData;
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
            // refresh
            const thisPage = window.location.pathname;
            goto("/").then(() => goto(thisPage));
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
        if (body.success) {
            // refresh
            const thisPage = window.location.pathname;
            goto("/").then(() => goto(thisPage));
        }
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
        if (body.success) {
            // refresh
            const thisPage = window.location.pathname;
            goto("/").then(() => goto(thisPage));
        }
        return body.success;
    }

    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");

        if (data.success && profile) {
            userNotFound = false;

            if (profile.username == accountData?.username) {
                goto("/profile");
            }

            if (profile.img_url) {
                image_data = profile.img_url;
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
    });
</script>

<Navbar />
<div class="space-y-4 p-4 m-auto">
    {#if userNotFound}
        <div class="bg-white border border-gray-300 rounded-lg shadow-sm">
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
        <div
            class="bg-white grid grid-cols-[auto_1fr] items-center gap-4 border border-gray-300 rounded-lg shadow-sm"
        >
            <div class="px-2 mt-8 flex flex-col items-center pb-8">
                <img
                    loading="lazy"
                    src={image_data}
                    class="w-20 h-20 rounded-full shadow-lg"
                    alt="pfp"
                />
            </div>
            <div class="w-full space-y-2 my-2 px-2">
                <div>
                    <p class="text-xl font-medium text-gray-900">
                        {profile.name}
                    </p>
                    <p class="text-sm text-gray-500">@{profile.username}</p>
                    <p class="whitespace-break-spaces text-sm text-gray-800">
                        {profile.bio}
                    </p>
                </div>
                <!-- Button section -->
                <div class="space-x-2">
                    <!-- If friendship status null  -->
                    {#if !friendshipStatus}
                        {#if !requestSent}
                            <button
                                type="button"
                                class="w-full text-center font-medium justify-center text-white bg-blue-600 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5 inline-flex shadow items-center"
                                on:click={async () => {
                                    await sendFriendRequest(profile.uuid);
                                }}
                            >
                                <svg
                                    class="mr-1 w-6 h-6 text-white"
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
                            <p class="text-gray-800 text-sm">Request sent</p>
                        {/if}
                    {:else if friendshipStatus === "PENDING"}
                        <p class=" font-bold text-gray-800 text-sm">
                            Friend request pending
                        </p>
                    {:else if friendshipStatus === "PENDING_YOU"}
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
                            Accept friend request
                        </button>
                    {:else if friendshipStatus === "ACCEPTED"}
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
                                        class="w-6 h-6"
                                        aria-hidden="true"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M16 12h4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                        />
                                    </svg>
                                    Remove friend
                                </span>
                            </button>
                        {/if}
                    {/if}
                </div>
            </div>
        </div>

        <!-- Posts -->
        <div class="grid grid-cols-3 gap-1">
            {#each posts as post}
                <a href="/post/{post.post_uuid}">
                    <div
                        class="rounded-lg overflow-hidden shadow-lg aspect-[1000/1618]"
                    >
                        <img
                            loading="lazy"
                            src={post.img_url}
                            alt="Post"
                            class="w-full h-full object-cover"
                        />
                    </div>
                </a>
            {:else}
                <div
                    class="flex items-center justify-center col-span-3 w-11/12 m-auto h-18"
                >
                    <hr class="flex-grow border-t border-gray-300" />
                    {#if friendshipStatus === "ACCEPTED"}
                        <span class="mx-4 text-gray-400 text-sm"
                            >User has no posts</span
                        >
                    {:else}
                        <span class="mx-4 text-gray-400 text-sm"
                            >Add as friend to see posts</span
                        >
                    {/if}

                    <hr class="flex-grow border-t border-gray-300" />
                </div>
            {/each}
        </div>
    {/if}
</div>
<Bottombar />
