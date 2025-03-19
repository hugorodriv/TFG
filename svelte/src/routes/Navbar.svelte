<script>
    import { signOut } from "@auth/sveltekit/client";
    import { onMount } from "svelte";
    import { accountStore } from "$lib/stores/accStore.js";
    import { goto } from "$app/navigation";

    const accountData = $accountStore;
    onMount(() => {
        const accountData = $accountStore;
        if (!accountData) {
            goto("/successfulLogin");
        }
    });
    const name = accountData?.name || "";

    onMount(() => {
        const dropdownBtn = document?.getElementById("dropdownBtn");
        const handleClickOutside = (/** @type {{ target: Event ; }} */ e) => {
            if (!dropdownBtn.contains(e.target)) {
                document.getElementById("dropdown")?.classList.add("hidden");
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    });
</script>

<nav class="bg-white shadow-sm py-3 px-6 flex items-center justify-between">
    <a href="/" class="text-xl font-bold text-gray-800">--- TFG ---</a>

    <div class="relative">
        <!-- Open dropdown menu -->
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
                {name.slice(0, 1).toUpperCase()}
            </div>

            <span class="text-gray-600 px-1">{name}</span>
        </button>

        <!-- Dropdown menu -->
        <div
            id="dropdown"
            class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50"
        >
            <a href="./profile" class="block px-4 py-2 hover:bg-gray-100">
                Profile
            </a>
            <button
                on:click|preventDefault={() => signOut()}
                class="w-max block px-4 py-2 hover:bg-gray-100"
            >
                Log Out
            </button>
        </div>
    </div>
</nav>
