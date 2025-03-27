<script>
    import { signOut } from "@auth/sveltekit/client";
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";

    let accountData;
    let pfp;

    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData")) || null;
        pfp = localStorage.getItem("pfp");

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
                <img alt="profile" src={pfp} />
            </div>

            <span class="text-gray-600 px-1">{accountData?.name}</span>
        </button>

        <!-- Dropdown menu -->
        <div
            id="dropdown"
            class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100"
        >
            <a href="./profile" class="block px-4 py-2 hover:bg-gray-100">
                Profile
            </a>
            <div class="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <button class="" on:click|preventDefault={() => signOut()}>
                    Log Out
                </button>
            </div>
        </div>
    </div>
</nav>
