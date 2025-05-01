<script>
    import { onMount } from "svelte";
    export let text;

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

<nav class="bg-white shadow-sm py-3 px-6 flex items-center justify-center">
    {#if text}
        <p class=" text-xl font-bold text-gray-800">{text}</p>
    {:else}
        <a href="/" class=" text-xl font-bold text-gray-800">SHARELLOC</a>
    {/if}
</nav>
