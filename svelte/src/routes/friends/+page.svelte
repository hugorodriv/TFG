<script>
    import Bottombar from "../Bottombar.svelte";
    import Navbar from "../Navbar.svelte";
    import { onMount } from "svelte";
    import ProfileCard from "./ProfileCard.svelte";
    import SearchProfileCard from "./SearchProfileCard.svelte";

    export let data;
    let loading = true;

    /**
     * @type {{ uuid: String; }}
     */
    let accountData;
    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");
        loading = false;
    });

    // Search
    /**
     * @type {any}
     */
    let searchResults;

    /**
     * @type {number}
     */
    let delayTimer;
    let searchError = false;

    async function updateSearchResults(e) {
        searchError = false;
        clearTimeout(delayTimer);

        // either username or name
        const searchQuery = e.target.value;
        if (!searchQuery) {
            searchResults = null;
            return;
        }
        // implement delay to not make too many requests
        searchResults = {};
        delayTimer = setTimeout(async () => {
            const response = await fetch("./api/search-username", {
                method: "POST",
                body: JSON.stringify({ searchQuery }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const body = await response.json();
            if (!body.list) {
                searchError = true;
                return;
            }

            // remove current account from list
            const results = body.list.filter(
                (/** @type {{ username: any; }} */ r) =>
                    r.username !== accountData.username,
            );
            if (results.length >= 1) {
                searchResults = results;
            } else {
                searchError = true;
                searchResults = null;
            }
        }, 300);
    }
</script>

{#if loading}
    <div class="space-y-4 p-4 max-w-md m-auto">
        <div
            class="text-center text-xl font-semibold mb-4 pb-2 border-b border-gray-200"
        >
            <div
                class="h-6 bg-gray-300 rounded w-1/3 mx-auto animate-pulse"
            ></div>
        </div>
        <div class="mb-14 space-y-2">
            <div class="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div class="py-4 flow-root">
            <ul role="list" class="">
                {#each Array(2) as _}
                    <div class="mt-5">
                        <div
                            class=" text-xl font-semibold mb-4 pb-2 border-b border-gray-200"
                        >
                            <div
                                class="h-6 bg-gray-300 rounded w-1/3 mx-auto animate-pulse"
                            ></div>
                        </div>

                        {#each Array(2) as _}
                            <li class="py-3 animate-pulse">
                                <div class="flex items-center">
                                    <div class="shrink-0">
                                        <div
                                            class="w-8 h-8 rounded-full bg-gray-300"
                                        ></div>
                                    </div>
                                    <div class="flex-1 min-w-0 ms-4 space-y-1">
                                        <div
                                            class="h-4 bg-gray-300 rounded w-1/2"
                                        ></div>
                                        <div
                                            class="h-3 bg-gray-200 rounded w-1/3"
                                        ></div>
                                    </div>
                                </div>
                            </li>
                        {/each}
                    </div>
                {/each}
            </ul>
        </div>
    </div>
    <Bottombar />
{:else}
    <Navbar text={"Friends"} />

    <div class="space-y-4 p-4 max-w-md m-auto">
        <!-- Search bar -->

        <div class="mb-14">
            <div class="relative mb-1">
                <div
                    class=" absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                >
                    <svg
                        class="mx-1 w-5 h-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </div>
                <input
                    autocomplete="off"
                    id="search"
                    class=" block w-full p-4 ps-10 text-gray-900 border border-gray-300 rounded-lg"
                    placeholder=" Search a name or username"
                    on:keyup={updateSearchResults}
                />
            </div>

            <!-- Search results popup -->
            <div class="relative">
                <div class="absolute inset-x-0 w-full z-40">
                    {#if searchResults}
                        {#if searchError}
                            <div
                                class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8"
                            >
                                <div class="flow-root">
                                    <ul
                                        role="list"
                                        class="divide-y divide-gray-200"
                                    >
                                        <li class="py-3">
                                            <span class="flex items-center">
                                                <div class="shrink-0"></div>
                                                <div
                                                    class="flex-1 min-w-0 ms-4"
                                                >
                                                    <p
                                                        class="font-medium text-gray-900 truncate"
                                                    >
                                                        Please enter a valid
                                                        search :)
                                                    </p>
                                                </div>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        {:else}
                            <div
                                class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8"
                            >
                                <div class="flow-root">
                                    <ul
                                        role="list"
                                        class="divide-y divide-gray-200"
                                    >
                                        {#each searchResults as user}
                                            <SearchProfileCard
                                                name={user.name}
                                                username={user.username}
                                                img_url={user.img_url}
                                            />
                                        {:else}
                                            <!-- skeleton -->
                                            {#if !searchError}
                                                {#each Array(3) as _}
                                                    <li
                                                        class="py-3 animate-pulse"
                                                    >
                                                        <div
                                                            class="flex items-center"
                                                        >
                                                            <div
                                                                class="shrink-0"
                                                            >
                                                                <div
                                                                    class="w-8 h-8 rounded-full bg-gray-300"
                                                                ></div>
                                                            </div>
                                                            <div
                                                                class="flex-1 min-w-0 ms-4 space-y-1"
                                                            >
                                                                <div
                                                                    class="h-4 bg-gray-300 rounded w-1/2"
                                                                ></div>
                                                                <div
                                                                    class="h-3 bg-gray-200 rounded w-1/3"
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                {/each}
                                            {/if}
                                        {/each}
                                    </ul>
                                </div>
                            </div>
                        {/if}
                    {/if}
                </div>
            </div>
        </div>

        <!-- Pending friend requests -->
        {#if data.pending.length > 0}
            <h2
                class="text-center text-xl font-semibold mb-4 pb-2 border-b border-gray-200"
            >
                Incoming Friend Requests
            </h2>
        {/if}
        <div class="flow-root">
            <ul role="list" class="">
                {#each data.pending as p}
                    <ProfileCard
                        name={p.sender_name}
                        username={p.sender_username}
                        img_url={p.sender_img_url}
                        sender_uuid={p.sender_uuid}
                        receiver_uuid={null}
                        acceptButton={true}
                    />
                {/each}
            </ul>
        </div>

        <!-- Friend list and requests -->

        {#if data.friendList.length > 0}
            <h2
                class="text-center text-xl font-semibold mb-4 pb-2 border-b border-gray-200"
            >
                Your Friends
            </h2>
            <div class="flow-root">
                <ul role="list" class="">
                    {#each data.friendList as p}
                        <ProfileCard
                            name={p.friend_name}
                            username={p.friend_username}
                            img_url={p.friend_img_url}
                            sender_uuid={null}
                            receiver_uuid={p.friend_uuid}
                            isFriend={true}
                        />
                    {/each}
                </ul>
            </div>
        {:else}
            <p class="my-5 text-center text">
                No friends found! Try looking somebody up :)
            </p>
        {/if}
        <!-- Sent requests -->
        {#if data.sentPending.length > 0}
            <h2
                class="text-center text-xl font-semibold mb-4 pb-2 border-b border-gray-200"
            >
                Sent Requests
            </h2>
        {/if}
        <div class="flow-root">
            <ul role="list">
                {#each data.sentPending as p}
                    <div class="opacity-60">
                        <ProfileCard
                            name={p.receiver_name}
                            username={p.receiver_username}
                            img_url={p.receiver_img_url}
                            sender_uuid={null}
                            receiver_uuid={p.receiver_uuid}
                        />
                    </div>
                {/each}
            </ul>
        </div>
    </div>

    <Bottombar friendsActive={true} />
{/if}
