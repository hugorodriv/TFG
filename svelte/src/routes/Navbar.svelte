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

<nav class="bg-white shadow-sm py-3 px-6 flex items-center justify-center">
    <a href="/" class=" text-xl font-bold text-gray-800">TFG</a>
</nav>
