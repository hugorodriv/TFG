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
                        class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-800"
                    >
                        Edit profile
                    </a>
                    <a
                        href="./signout/"
                        on:click|preventDefault={() => signOut()}
                        class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-800"
                    >
                        Log out
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
