<script>
    import { signOut } from "@auth/sveltekit/client";
    import Bottombar from "../Bottombar.svelte";
    import Navbar from "../Navbar.svelte";
    import { onMount } from "svelte";

    export let data;
    const posts = data.posts;
    let loading = true;

    /**
     * @type {{ name: any; username: any; bio: any; }}
     */
    let accountData;
    /**
     * @type {string | null}
     */
    let pfp;
    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");
        pfp = localStorage.getItem("pfp");
        loading = false;
    });
</script>

{#if loading}
    <div class="space-y-4 p-4 max-w-md m-auto">
        <div>
            <div
                class="grid grid-cols-[auto_1fr] items-center gap-4 border border-gray-200 rounded-lg shadow-sm"
            >
                <div class="px-5 mt-10 flex flex-col items-center pb-10">
                    <div
                        class="w-20 h-20 rounded-full bg-gray-200 animate-pulse"
                    ></div>
                </div>
                <div class="w-full space-y-2">
                    <div>
                        <div
                            class="h-6 w-1/3 bg-gray-200 rounded animate-pulse"
                        ></div>
                        <div
                            class="h-4 w-1/4 bg-gray-200 rounded animate-pulse mt-2"
                        ></div>
                        <div
                            class="h-4 w-2/3 bg-gray-200 rounded animate-pulse mt-2"
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-3 gap-1">
            {#each Array(9) as _}
                <div class="rounded-lg overflow-hidden shadow-lg mt-1">
                    <div class="w-full h-48 bg-gray-200 animate-pulse"></div>
                </div>
            {/each}
        </div>
    </div>

    <Bottombar profileActive={true} />
{:else}
    <Navbar text={"Profile"} />

    <div class="space-y-4 p-4 max-w-md m-auto">
        <div
            class="grid grid-cols-[auto_1fr] items-center gap-4 border border-gray-200 rounded-lg shadow-sm"
        >
            <div class="px-5 mt-10 flex flex-col items-center pb-10">
                <img
                    class="w-20 h-20 rounded-full shadow-lg"
                    src={pfp}
                    alt="pfp"
                />
            </div>
            <div class="w-full space-y-2 my-2">
                <div>
                    <p class="text-xl font-medium text-gray-900">
                        {accountData.name}
                    </p>
                    <p class="text-sm text-gray-500">
                        @{accountData.username}
                    </p>
                    <p class="whitespace-break-spaces text-sm text-gray-800">
                        {accountData.bio}
                    </p>
                </div>
                <div class="space-x-2">
                    <a
                        href="/settings"
                        class="px-4 py-2 inline-flex text-sm font-medium text-gray-800 hover:text-gray-900 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors"
                    >
                        <span class="flex items-center gap-2">
                            <svg
                                class="w-6 h-6"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="square"
                                    stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z"
                                />
                            </svg>
                            Edit Profile
                        </span>
                    </a>

                    <a
                        href="/signout/"
                        on:click|preventDefault={() => signOut()}
                        class="px-4 py-2 inline-flex text-sm font-medium text-red-600 hover:text-red-800 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors"
                    >
                        <span class="flex items-center gap-2">
                            <svg
                                class="w-6 h-6"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M18 18V6h-5v12h5Zm0 0h2M4 18h2.5m3.5-5.5V12M6 6l7-2v16l-7-2V6Z"
                                />
                            </svg>
                            Log out
                        </span>
                    </a>
                </div>
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
    </div>
    <Bottombar profileActive={true} />
{/if}
