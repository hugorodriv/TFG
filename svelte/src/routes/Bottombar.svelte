<script>
    import { onMount } from "svelte";

    export let homeActive = false;
    export let searchActive = false;
    export let friendsActive = false;
    export let profileActive = false;

    /**
     * @type {string}
     */
    let pfp;
    let accountData;
    let loading = true;
    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");
        pfp = localStorage.getItem("pfp");
        loading = false;
    });
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<div class="pb-24">
    <div
        class="mt-10 fixed z-50 w-11/12 max-w-lg h-16 -translate-x-1/2 bottom-4 left-1/2 bg-white border border-gray-300 rounded-full"
    >
        <div class="grid grid-cols-5 h-full mx-auto">
            <!-- Home button -->
            <a
                href="/"
                class="flex flex-col items-center justify-center px-5 group"
            >
                <svg
                    class="w-7 h-7 {homeActive ? 'active' : 'inactive'} hovered"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                    />
                </svg>
            </a>

            <!-- Search -->
            <a
                href="/search"
                class="flex flex-col items-center justify-center px-5 group"
            >
                <svg
                    class="w-7 h-7 {searchActive
                        ? 'active'
                        : 'inactive'} hovered"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="2"
                        d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                    />
                </svg>
            </a>

            <!-- Upload post -->
            <a
                href="/upload"
                class="flex flex-col items-center justify-center px-5 bg-blue-600 hover:bg-blue-700 rounded-full group"
            >
                <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 18 18">
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 1v16M1 9h16"
                    />
                </svg>
            </a>

            <!-- Map -->
            <a
                href="/friends"
                class="flex flex-col items-center justify-center px-5 group"
            >
                <svg
                    class="w-7 h-7 {friendsActive
                        ? 'active'
                        : 'inactive'} hovered"
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
                        stroke-width="2"
                        d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                </svg>
            </a>

            <!-- Profile -->
            <a
                href="/profile"
                class="flex flex-col items-center justify-center group"
            >
                <div
                    class="drop-shadow-lg w-8 h-8 {profileActive
                        ? 'activeImg'
                        : ''}"
                >
                    <img alt="pfp" src={pfp} />
                </div>
            </a>
        </div>
    </div>
</div>

<style>
    .active {
        color: black;
    }
    .activeImg {
        border: 2px solid black;
        border-radius: 9999px;
        padding: 1px;
        background-clip: content-box;
        box-sizing: border-box;
    }
    .inactive {
        color: gray;
    }
    .hovered:hover {
        color: #2563eb;
    }
</style>
