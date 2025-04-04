<script>
    import { signOut } from "@auth/sveltekit/client";
    import { onMount } from "svelte";

    /**
     * @type {{ name: String; username: String; }}
     */
    let accountData;
    /**
     * @type {string}
     */
    let pfp;

    /**
     * @param {MouseEvent} e
     */
    function handleClickOutside(e) {
        const dropdownBtn = document.getElementById("dropdownBtn");

        const target = /** @type {Node | null} */ (e.target);
        if (!dropdownBtn?.contains(target)) {
            document.getElementById("dropdown")?.classList.add("hidden");
        }
    }

    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");
        pfp = localStorage.getItem("pfp") || "";

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    });
</script>

<nav class="bg-white shadow-sm py-3 px-6 flex items-center justify-between">
    <a href="/" class="text-xl font-bold text-gray-800">--- TFG ---</a>

    <div class="relative">
        <!-- Open dropdown button -->
        <button
            id="dropdownBtn"
            on:click={() => {
                document
                    ?.getElementById("dropdown")
                    ?.classList.toggle("hidden");
            }}
            class="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-1 transition-colors"
        >
            <div
                class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"
            >
                <img alt="profile" src={pfp} />
            </div>

            <span class="text-gray-600 px-1">{accountData?.name}</span>
            <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 10 6">
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                />
            </svg>
        </button>

        <!-- Dropdown menu -->
        <div
            id="dropdown"
            class="z-50 hidden absolute right-0 bg-white mt-4 w-48 rounded-md shadow-lg py-1 border border-gray-200"
        >
            <div class="text-center px-4 py-3 border-b-1 border-gray-200">
                <div>{accountData?.name}</div>
                <div class="font-medium truncate">@{accountData?.username}</div>
            </div>
            <div
                class="border-b-1 border-gray-200 py-2 text-sm text-gray-700 dark:text-gray-200"
            >
                <div>
                    <a
                        href="/friends"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >Friends</a
                    >
                </div>
                <div>
                    <a
                        href="/profile"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >Profile Settings</a
                    >
                </div>
            </div>
            <div class="py-2">
                <a
                    href="./signout/"
                    on:click|preventDefault={() => signOut()}
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >Sign out</a
                >
            </div>
        </div>
    </div>
</nav>
