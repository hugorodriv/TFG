<script>
    import { dev } from "$app/environment";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    import Bottombar from "../../Bottombar.svelte";
    import Navbar from "../../Navbar.svelte";

    export let data;

    let notFound = true;
    if (data?.success) {
        notFound = false;
    }
    let confirmDeletePost = false;
    const post = data.post;
    const owner = data.isOwner;

    let editingText = false;

    let pfp_data;

    onMount(() => {
        if (post.pfp_url) {
            pfp_data = post.pfp_url;
        } else {
            // if no img data, create blue bg and white letter (default pfp)
            const letter = post.poster_name.slice(0, 1).toUpperCase();
            const svg = `
            <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <circle cx="64" cy="64" r="64" fill="#007BFF"/>
                <text x="64" y="64" font-size="64" fill="white" font-family="sans-serif"
                    text-anchor="middle" dominant-baseline="central">
                    ${letter}
                </text>
            </svg>`;
            pfp_data = `data:image/svg+xml;base64,${btoa(svg)}`;
        }
    });

    async function removePost() {
        const response = await fetch("/api/remove-post", {
            method: "POST",
            body: JSON.stringify({
                post_uuid: post.post_uuid,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        try {
            const data = await response.json();
            if (data?.success) {
                goto("/profile");
            }
        } catch (error) {
            alert("Error removing post");
            return false;
        }
        return false;
    }
    async function changePostText() {
        const newText = document?.getElementById("updatedPostText")?.value;
        if (newText === post.text) return;

        const response = await fetch("/api/change-post-text", {
            method: "POST",
            body: JSON.stringify({
                post_uuid: post.post_uuid,
                newText: newText,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        try {
            const data = await response.json();
            if (data?.success) {
                // refresh after successful Text editing
                const thisPage = window.location.pathname;
                goto("/").then(() => goto(thisPage));
            }
        } catch (error) {
            alert("Error removing post");
            return false;
        }
        return false;
    }

    function getTimeAgo(timestamp) {
        const now = new Date();
        let pastDate;
        if (dev) {
            pastDate = new Date(Date.parse(timestamp + "Z"));
        } else {
            pastDate = new Date(Date.parse(timestamp));
        }
        const diffSec = (now - pastDate) / 1000;

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

<Navbar />
{#if notFound}
    <div class="space-y-4 p-4 max-w-md m-auto">
        <div class="bg-white border border-gray-300 mt-10 rounded-lg shadow-sm">
            <div class="mt-10 flex flex-col items-center pb-10">
                <p class="text-xl font-medium text-gray-900">Post not found</p>

                <p class=" text-gray-900">
                    Or you dont have permission to view it
                </p>
            </div>
        </div>
    </div>
{:else}
    <div class="p-4 m-auto w-11/12">
        <div class="border border-gray-300 rounded-lg shadow-lg">
            <div class="rounded-t-lg bg-white px-2 flex items-center">
                <div class="flex flex-row">
                    <a href={"../p/" + post.username} class="flex space-x-4">
                        <img
                            alt="profile"
                            src={pfp_data}
                            class="shadow-lg w-10 h-10 rounded-full"
                        />
                        <div>
                            <div class="flex-row flex">
                                <p class="font-semibold">
                                    {post.poster_name}
                                </p>
                                <p class="ml-auto font-bold text-gray-400 px-1">
                                    ·
                                </p>
                                <div
                                    class="align-middle m-auto text-sm text-gray-400"
                                >
                                    {getTimeAgo(post.created_at)}
                                </div>
                            </div>
                            <p class="text-sm text-gray-500">
                                {post.resolved_location}
                            </p>
                        </div>
                    </a>
                </div>
                <a
                    aria-label="Navigate to post"
                    href={`https://www.google.com/maps/place/${post.lat},${post.lon}`}
                    class="flex flex-col items-center justify-center ml-auto p-2"
                >
                    <svg
                        class="text-gray-600 w-8 h-8"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                    >
                        <path
                            fill="currentColor"
                            d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152l0 270.8c0 9.8-6 18.6-15.1 22.3L416 503l0-302.6zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6l0 251.4L32.9 502.7C17.1 509 0 497.4 0 480.4L0 209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77l0 249.3L192 449.4 192 255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
                        />
                    </svg>
                    <span class="text-xs text-gray-600">Go</span>
                </a>
            </div>
            <img alt="post" class="rounded-b-lg m-auto" src={post.img_url} />
        </div>
        {#if editingText}
            <div
                class="shadow bg-white p-4 m-auto border border-gray-300 my-3 rounded-lg h-32 overflow-auto relative"
            >
                <textarea
                    maxlength="2048"
                    value={post.text}
                    id="updatedPostText"
                    class="w-full h-full resize-none focus:outline-none"
                ></textarea>
                <span class="absolute top-1 right-2 text-xs text-gray-500"
                    >Editing</span
                >
            </div>
        {:else}
            <div
                class="shadow bg-white p-4 m-auto border border-gray-300 my-3 rounded-lg h-32 overflow-auto relative"
            >
                <p class="whitespace-break-spaces">{post.text}</p>
            </div>
        {/if}

        {#if owner}
            {#if confirmDeletePost}
                <button
                    on:click={async (e) => {
                        await removePost();
                    }}
                    class="px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-800 bg-white border-gray-300 border rounded-lg transition-colors"
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
                    on:click={() => {
                        confirmDeletePost = true;
                    }}
                    class="px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-800 bg-white border-gray-300 border rounded-lg transition-colors"
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

                {#if editingText}
                    <button
                        on:click={async (e) => {
                            await changePostText();
                        }}
                        class="px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                        <span class="flex items-center gap-2">
                            <svg
                                class="w-5 h-5 text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
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
                                    d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0
                                    0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0
                                    1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0
                                    2.853l-6.844 6.844L8 14l.713-3.565
                                    6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                />
                            </svg>
                            Submit
                        </span>
                    </button>
                {:else}
                    <button
                        on:click={() => {
                            editingText = true;
                        }}
                        class="px-4 py-2.5 text-sm font-medium text-gray-800 hover:text-gray-900 bg-white border-gray-300 border rounded-lg transition-colors"
                    >
                        <span class="flex items-center gap-2">
                            <svg
                                class="w-5 h-5 text-gray-800"
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
                                    d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0
                                    0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0
                                    1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0
                                    2.853l-6.844 6.844L8 14l.713-3.565
                                    6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                />
                            </svg>
                            Edit Text
                        </span>
                    </button>
                {/if}
            {/if}
        {/if}
    </div>
{/if}
<Bottombar />
