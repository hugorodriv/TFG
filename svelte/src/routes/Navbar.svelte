<script>
    import { onMount } from "svelte";
    export let text;
    export let showBack = true;

    /**
     * @type {{ name: String; username: String; }}
     */
    let accountData;
    /**
     * @type {string}
     */
    let pfp;

    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");
        pfp = localStorage.getItem("pfp") || "";
    });
</script>

<nav class="bg-white shadow-sm py-3 px-6 flex items-center">
    <!-- Back button container - fixed width to ensure positioning -->
    <div class="w-8">
        {#if showBack}
            <button
                on:click={() => {
                    const referrer = document.referrer;

                    if (
                        referrer &&
                        new URL(referrer).hostname === window.location.hostname
                    ) {
                        history.back();
                    } else {
                        window.location.href = "/";
                    }
                }}
                aria-label="Go back"
                class="flex items-center justify-center p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
            >
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
                        stroke-width="2.5"
                        d="M5 12h14M5 12l4-4m-4 4 4 4"
                    />
                </svg>
            </button>
        {/if}
    </div>

    <!-- Logo - centered with flex-grow -->
    <div class="flex-grow text-center">
        <p class="text-xl font-bold text-gray-800">{text || "SHARELLOC"}</p>
    </div>

    <!-- Spacer to balance the layout -->
    <div class="w-8 flex-shrink-0"></div>
</nav>
