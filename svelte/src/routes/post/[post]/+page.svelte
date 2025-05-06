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

    let loading = true;
    let editingText = false;

    let pfp_data;

    onMount(() => {
        loading = false;

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
    {#if notFound}
        <div class="space-y-4 p-4 max-w-md m-auto">
            <div class="border border-gray-200 rounded-lg shadow-sm">
                <div class="mt-10 flex flex-col items-center pb-10">
                    <p class="text-xl font-medium text-gray-900">
                        Post not found
                    </p>

                    <p class=" text-gray-900">
                        Or you dont have permission to view it
                    </p>
                </div>
            </div>
        </div>
    {:else}
        <div class="space-y-2 p-4 max-w-md m-auto w-11/12">
            <a href={"../p/" + post.username} class=" flex items-center gap-3">
                <img
                    alt="profile"
                    src={pfp_data}
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
            <img
                alt="post"
                class="rounded-lg shadow-lg m-auto"
                src={post.img_url}
            />
            {#if editingText}
                <div
                    class="p-4 m-auto bg-gray-100 border border-gray-300 my-2 rounded h-32 overflow-auto relative"
                >
                    <textarea
                        maxlength="2048"
                        value={post.text}
                        id="updatedPostText"
                        class="w-full h-full resize-none bg-transparent"
                    ></textarea>
                    <span class="absolute top-1 right-2 text-xs text-gray-500"
                        >Editing</span
                    >
                </div>
            {:else}
                <div
                    class="p-4 m-auto bg-gray-100 my-2 rounded h-32 overflow-auto"
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
                        on:click={() => {
                            confirmDeletePost = true;
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
                            class="px-4 py-2.5 text-sm font-medium text-gray-800 hover:text-gray-900 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors"
                        >
                            <span class="flex items-center gap-2">
                                <svg
                                    class="w-5 h-5 text-gray-800"
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
                                Edit Text
                            </span>
                        </button>
                    {/if}
                {/if}
            {/if}
        </div>
    {/if}
    <Bottombar />
{/if}
