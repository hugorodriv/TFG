<script>
    import Bottombar from "../Bottombar.svelte";
    import Navbar from "../Navbar.svelte";
    import { onMount } from "svelte";
    import ProfileCard from "./ProfileCard.svelte";

    export let data;

    let searchResults;

    /**
     * @type {{ username: String; }}
     */
    let accountData;
    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");

        document.getElementById("search")?.focus();
    });

    /**
     * @param {{ target: { value: String; }; }} e
     */
    function updateSearchResults(e) {
        const username = e.target.value;
        if (!username) {
            searchResults = null;
            return;
        }
        setTimeout(async () => {
            const response = await fetch("./api/search-username", {
                method: "POST",
                body: JSON.stringify({ username }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const body = await response.json();

            // remove current account from list
            const results = body.list.filter(
                (/** @type {{ username: any; }} */ r) =>
                    r.username !== accountData.username,
            );
            if (results.length >= 1) {
                searchResults = results;
            } else {
                searchResults = null;
            }
        }, 300);
    }
</script>

<Navbar />

<div class="space-y-4 p-4 max-w-md m-auto">
    <p class="mt-10 text-center text-xl">Search</p>
    <div>
        <div class="relative">
            <div
                class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
            >
                <svg
                    class="w-4 h-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 20 20"
                >
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                </svg>
            </div>
            <input
                autocomplete="off"
                type="search"
                id="search"
                class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="username"
                on:keyup={updateSearchResults}
            />
        </div>
        <div>
            {#if searchResults}
                <div
                    class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8"
                >
                    <div class="flow-root">
                        <ul role="list" class="divide-y divide-gray-200">
                            {#each searchResults as user}
                                <ProfileCard
                                    name={user.name}
                                    username={user.username}
                                    img_url={user.img_url}
                                    uuid={user.uuid}
                                />
                            {/each}
                        </ul>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<Bottombar searchActive={true} />
