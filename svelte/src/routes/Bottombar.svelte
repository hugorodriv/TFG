<script>
    import { locationStore } from "$lib/stores/location";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    export let homeActive = false;
    export let mapActive = false;
    export let friendsActive = false;
    export let profileActive = false;

    /**
     * @type {string}
     */
    let pfp;
    let accountData;
    let showWarning = false;
    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");
        pfp = localStorage.getItem("pfp");
    });
    async function launchProtected(route) {
        if (!locationStore.isExpired()) {
            goto(route);
        } else {
            showWarning = true;
            setTimeout(() => {
                showWarning = false;
                goto("/");
            }, 500);
        }
    }
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<div class="pb-12">
    {#if showWarning}
        <div
            class="-translate-y-9 w-10/12 fixed bottom-12 left-1/2 z-50 max-w-md
            -translate-x-1/2 px-6 py-3 bg-gray-600 text-white text-center
            rounded-full"
        >
            <p class="text-sm font-medium">
                Location is required for this function
            </p>
        </div>
    {/if}
    <div
        class="left-0 fixed bottom-11 w-full h-4 bg-gradient-to-b from-transparent to-white/30"
    >
        <div
            class="w-full h-14 bg-white bottom-0 translate-y-1 mx-auto border-t border-gray-200"
        >
            <div
                class="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[400px] w-11/12 m-auto h-14"
            >
                <div class="grid grid-cols-5 h-full mx-auto">
                    <!-- Home button -->
                    <a
                        href="/"
                        class="flex flex-col items-center justify-center px-5 group"
                    >
                        <svg
                            class="w-7 h-7 {homeActive ? 'active' : 'inactive'}"
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

                    <!-- Map -->
                    <button
                        on:click={async () => {
                            await launchProtected("/map");
                        }}
                        class="flex flex-col items-center justify-center px-5 group"
                    >
                        <svg
                            class="w-7 h-7 {mapActive ? 'active' : 'inactive'}"
                            fill="currentColor"
                            viewBox="0 0 576 512"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-width="2"
                                d="M565.6 36.2C572.1 40.7 576 48.1 576 56l0 336c0
                        10-6.2 18.9-15.5 22.4l-168 64c-5.2 2-10.9 2.1-16.1
                        .3L192.5 417.5l-160 61c-7.4 2.8-15.7 1.8-22.2-2.7S0
                        463.9 0 456L0 120c0-10 6.1-18.9 15.5-22.4l168-64c5.2-2
                        10.9-2.1 16.1-.3L383.5 94.5l160-61c7.4-2.8 15.7-1.8
                        22.2 2.7zM48 136.5l0 284.6 120-45.7 0-284.6L48
                        136.5zM360 422.7l0-285.4-144-48 0 285.4 144
                        48zm48-1.5l120-45.7 0-284.6L408 136.5l0 284.6z"
                            />
                        </svg>
                    </button>

                    <!-- Upload post -->
                    <button
                        on:click={async () => {
                            await launchProtected("/upload");
                        }}
                        class=" h-11/12 m-auto w-full max-w-20 flex flex-col items-center justify-center px-5 bg-blue-600 rounded-full group"
                    >
                        <svg
                            class="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 18 18"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 1v16M1 9h16"
                            />
                        </svg>
                    </button>

                    <!-- Friends -->
                    <a
                        href="/friends"
                        class="flex flex-col items-center justify-center px-5 group"
                    >
                        <svg
                            class="w-7 h-7 {friendsActive
                                ? 'active'
                                : 'inactive'}"
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
                            class="rounded-full p-[1px] border-2 border-gray-300 drop-shadow-lg w-9 h-9 {profileActive
                                ? 'activeImg'
                                : ''}"
                        >
                            <img alt="pfp" src={pfp} />
                        </div>
                    </a>
                </div>
            </div>
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
    }
    .inactive {
        color: gray;
    }
</style>
