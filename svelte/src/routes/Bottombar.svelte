<script>
    export let homeActive = false;
    export let searchActive = false;
    export let mapActive = false;
    export let accoutntsActive = false;
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
            <button
                class="flex flex-col items-center justify-center px-5 group"
            >
                <svg
                    class="w-7 h-7 {mapActive ? 'active' : 'inactive'} hovered"
                    fill="currentColor"
                    viewBox="0 0 576 512"
                >
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M565.6 36.2C572.1 40.7 576 48.1 576 56l0 336c0 10-6.2 18.9-15.5 22.4l-168 64c-5.2 2-10.9 2.1-16.1 .3L192.5 417.5l-160 61c-7.4 2.8-15.7 1.8-22.2-2.7S0 463.9 0 456L0 120c0-10 6.1-18.9 15.5-22.4l168-64c5.2-2 10.9-2.1 16.1-.3L383.5 94.5l160-61c7.4-2.8 15.7-1.8 22.2 2.7zM48 136.5l0 284.6 120-45.7 0-284.6L48 136.5zM360 422.7l0-285.4-144-48 0 285.4 144 48zm48-1.5l120-45.7 0-284.6L408 136.5l0 284.6z"
                    />
                </svg>
            </button>

            <!-- Accs to follow -->
            <button
                class="flex flex-col items-center justify-center px-5 group"
            >
                <svg
                    class="w-7 h-7 {accoutntsActive
                        ? 'active'
                        : 'inactive'} hovered"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 6H5m2 3H5m2 3H5m2 3H5m2 3H5m11-1a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2M7 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                    />
                </svg>
            </button>
        </div>
    </div>
</div>

<style>
    .active {
        color: black;
    }
    .inactive {
        color: gray;
    }
    .hovered:hover {
        color: #2563eb;
    }
</style>
