<script>
    import { accountStore } from "$lib/stores/accStore.js";
    import { goto } from "$app/navigation";

    // import { get } from "svelte/store";
    import Auth from "./auth.svelte";
    import Navbar from "./Navbar.svelte";

    export let data;
    const session = data.session;

    const accountData = $accountStore;
    if (!accountData) {
        goto("succesfulLogin");
    }
</script>

<div>
    {#if !session}
        <Auth />
    {:else}
        <Navbar />
    {/if}
</div>
