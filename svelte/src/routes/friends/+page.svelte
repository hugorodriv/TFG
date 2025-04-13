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

    const letter = "?";
    const svg = `
        <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
            <circle cx="64" cy="64" r="64" fill="#cad5e2"/>
            <text x="64" y="64" font-size="64" fill="black" font-family="sans-serif"
                text-anchor="middle" dominant-baseline="central">
                ${letter}
            </text>
        </svg>`;
    const errorSearchPfp = `data:image/svg+xml;base64,${btoa(svg)}`;
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
        <!-- Search bar -->

        <h2
            class="text-center text-xl font-semibold mb-4 pb-2 border-b border-gray-200"
        >
            Add friends
        </h2>
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
                                            <!-- spinner -->
                                            {#if !searchError}
                                                <div class="text-center">
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
                    <ProfileCard
                        name={p.receiver_name}
                        username={p.receiver_username}
                        img_url={p.receiver_img_url}
                        sender_uuid={null}
                        receiver_uuid={p.receiver_uuid}
                    />
                {/each}
            </ul>
        </div>
    </div>

    <Bottombar friendsActive={true} />
{/if}
